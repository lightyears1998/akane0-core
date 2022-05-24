import "reflect-metadata";
import path from "path";

import fs from "fs-extra";
import debug from "debug";
import registerCleanUpHandler from "node-cleanup";

import { CORE_ADAPTERS, CORE_BEHAVIORS } from "./config";
import { installPlugins, adapterResolver, behaviorResolver } from "./plugin";
import { AkaneAdapter } from "./interface";

export const debugPrint = debug("akane0-core");

export const rootPath = path.resolve(path.join(__dirname, ".."));
export const varPath = path.join(rootPath, "./var");
export const adaptersPath = path.join(rootPath, "./adapters");
export const behaviorsPath = path.join(rootPath, "./behaviors");

const adapters: Array<AkaneAdapter> = [];

function printDebugInfo() {
  const parameters = { ADAPTERS: CORE_ADAPTERS };
  debugPrint("parameters", parameters);
}

async function ensureDirs() {
  for (const path of [varPath, adaptersPath, behaviorsPath]) {
    await fs.ensureDir(path);
  }
}

async function installAdapters() {
  await installPlugins(CORE_ADAPTERS, adapterResolver);
}

async function installBehaviors() {
  await installPlugins(CORE_BEHAVIORS, behaviorResolver);
  return;
}

async function startAdapters() {
  const startupTasks = Promise.allSettled(
    adapters.map((adapter) => adapter.start())
  );
  await startupTasks;
}

function stopAdapters() {
  adapters.map((adapter) => adapter.stop());
}

async function bootstrap() {
  printDebugInfo();
  await ensureDirs();

  await installAdapters();
  await installBehaviors();

  await startAdapters();
}
bootstrap();

registerCleanUpHandler(function (exitCode, signal) {
  debugPrint("performing clean-up and exiting.", { exitCode, signal });
  stopAdapters();
});
