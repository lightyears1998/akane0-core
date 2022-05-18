import path from "path";

import fs from "fs-extra";
import debug from "debug";
import registerCleanUpHandler from "node-cleanup";

import {
  MIRAI_HOST, MIRAI_HTTP_BASIC_AUTH, MIRAI_HTTP_PORT, MIRAI_ADAPTER_QQ, MIRAI_VERIFY_KEY, MIRAI_WS_PORT, MIRAI_MASTER_QQ
} from "./config";
import { resolveAdapter } from "./plugin";
import { AkaneAdapter } from "./interface";

export const debugPrint = debug("akane");

export const rootPath = path.resolve(path.join(__dirname, ".."));
export const varPath = path.join(rootPath, "./var");
export const adaptersPath = path.join(rootPath, "./adapters");

const adapters: Array<AkaneAdapter> = [];

function printDebugInfo() {
  const miraiParameters = {
    MIRAI_HOST, MIRAI_HTTP_BASIC_AUTH, MIRAI_VERIFY_KEY, MIRAI_HTTP_PORT, MIRAI_WS_PORT, MIRAI_ADAPTER_QQ, MIRAI_MASTER_QQ
  };
  debugPrint("miraiParameters", miraiParameters);
}

async function ensureDirs() {
  for (const path of [varPath, adaptersPath]) {
    await fs.ensureDir(path);
  }
}

async function installAdapters() {
  const candidateAdapterNames = (process.env.ADAPTERS || "").split(",").map(name => name.trim());
  for (const name of candidateAdapterNames) {
    let adapterConstructor;
    try {
      const adapterLibPath = resolveAdapter(name);
      adapterConstructor = (await import(adapterLibPath)).default;
    } catch {
      console.error(`Can't find adapter named ${name}.`);
      continue;
    }

    try {
      const adapter = new adapterConstructor();
      adapters.push(adapter);
    } catch {
      console.error(`Error initializing adapter named ${name}.`);
    }
  }
}

async function startAdapters() {
  const startupTasks = Promise.allSettled(adapters.map(adapter => adapter.start()));
  await startupTasks;
}

function stopAdapters() {
  adapters.map(adapter => adapter.stop());
}

async function bootstrap() {
  printDebugInfo();
  await ensureDirs();
  await installAdapters();
  await startAdapters();
}
bootstrap();

registerCleanUpHandler(function (exitCode, signal) {
  debugPrint({ exitCode, signal });
  stopAdapters();
});
