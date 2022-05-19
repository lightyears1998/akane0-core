import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// akane0-core
export const ADAPTERS = (process.env.ADAPTERS || "").split(",").map(name => name.trim());
