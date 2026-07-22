import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { coverage, scorecards } from "../data/platform";

export function ResilienceRadar() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={scorecards}>
        <PolarGrid />
        <PolarAngleAxis dataKey="domain" tick={{ fill: "currentColor", fontSize: 11 }} />
        <Radar dataKey="target" stroke="#93c5fd" fill="#93c5fd" fillOpacity={0.16} />
        <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.35} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function CoverageBars() {
  const data = coverage.map((item) => ({
    framework: item.framework,
    coverage: Math.round((item.covered / item.total) * 100)
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="framework" tick={{ fill: "currentColor", fontSize: 11 }} />
        <YAxis tick={{ fill: "currentColor", fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="coverage" fill="#ef6c3e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
