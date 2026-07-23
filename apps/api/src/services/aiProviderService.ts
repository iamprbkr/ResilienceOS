const OLLAMA_BASE = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";
const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export type AIProviderName = "ollama" | "openai" | "none";

function detectProvider(): AIProviderName {
  if (OPENAI_KEY) return "openai";
  return "ollama";
}

async function ollamaGenerate(prompt: string, system?: string): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      system: system ?? "",
      stream: false,
      options: { temperature: 0.7, num_predict: 2048 }
    })
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  const data = await res.json() as { response: string };
  return data.response;
}

async function openaiGenerate(prompt: string, system?: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        ...(system ? [{ role: "system" as const, content: system }] : []),
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${res.statusText}`);
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? "";
}

let providerCache: AIProviderName | null = null;

export function getProvider(): AIProviderName {
  if (!providerCache) providerCache = detectProvider();
  return providerCache;
}

export function resetProviderCache(): void {
  providerCache = null;
}

export async function generateText(prompt: string, system?: string): Promise<string> {
  const provider = getProvider();
  if (provider === "openai") return openaiGenerate(prompt, system);
  if (provider === "ollama") {
    try {
      return await ollamaGenerate(prompt, system);
    } catch {
      return "";
    }
  }
  return "";
}

export async function isAvailable(): Promise<boolean> {
  if (OPENAI_KEY) return true;
  if (providerCache === "none") return false;
  try {
    await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(3000) });
    providerCache = "ollama";
    return true;
  } catch {
    providerCache = "none";
    return false;
  }
}
