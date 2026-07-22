import { inMemoryRepository } from "./inMemoryRepository.js";
import { postgresRepository } from "./postgresRepository.js";

export const repository = process.env.REPOSITORY_DRIVER === "postgres" ? postgresRepository : inMemoryRepository;
