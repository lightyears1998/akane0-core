import path from "path";

import fs from "fs-extra";
import debug from "debug";

const debugEcho = debug("akane");

import {
  MIRAI_HOST, MIRAI_HTTP_BASIC_AUTH, MIRAI_HTTP_PORT, MIRAI_ADAPTER_QQ, MIRAI_VERIFY_KEY, MIRAI_WS_PORT, MIRAI_MASTER_QQ
} from "./config";
import { resolveAdapter } from "./plugin";

debugEcho(MIRAI_HOST, MIRAI_HTTP_BASIC_AUTH, MIRAI_VERIFY_KEY, MIRAI_HTTP_PORT, MIRAI_WS_PORT, MIRAI_ADAPTER_QQ, MIRAI_MASTER_QQ);

export const rootPath = path.resolve(path.join(__dirname, ".."));
export const varPath = path.join(rootPath, "./var");
export const adaptersPath = path.join(rootPath, "./adapters");

async function ensureDirs() {
  for (const path of [varPath, adaptersPath]) {
    await fs.ensureDir(path);
  }
}

async function installAdapters() {
  const candidateAdapterNames = (process.env.ADAPTERS || "").split(",").map(name => name.trim());
  for (const name of candidateAdapterNames) {
    try {
      resolveAdapter(name);
    } catch {
      console.error(`Can't find adapter named ${name}.`);
    }
  }
}

async function bootstrap() {
  await ensureDirs();
  await installAdapters();
}
bootstrap();
