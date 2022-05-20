import { config as dotenvConfig } from "dotenv";
dotenvConfig();

// akane0-core
export const CORE_ADAPTERS = (process.env.CORE_ADAPTERS || "")
  .split(",")
  .map((name) => name.trim());
export const CORE_BEHAVIORS = (process.env.CORE_ADAPTERS || "")
  .split(",")
  .map((name) => name.trim());

console.log(111, CORE_ADAPTERS, CORE_BEHAVIORS);
