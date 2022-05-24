import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// akane0-core
export const CORE_ADAPTERS = (process.env.CORE_ADAPTERS || "")
  .split(",")
  .map((name) => name.trim())
  .filter((name) => name.length > 0);
export const CORE_BEHAVIORS = (process.env.CORE_BEHAVIORS || "")
  .split(",")
  .map((name) => name.trim())
  .filter((name) => name.length > 0);
