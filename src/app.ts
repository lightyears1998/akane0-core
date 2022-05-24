import "reflect-metadata";
import path from "path";

import fs from "fs-extra";
import debug from "debug";
import registerCleanUpHandler from "node-cleanup";
import { DataSource } from "typeorm";

import { CORE_ADAPTERS, CORE_BEHAVIORS } from "./config";
import { installPlugins, adapterResolver, behaviorResolver } from "./plugin";
import { AkaneAdapter, AkaneBehavior } from "./interface";
import { initMasterIdentity } from "./entity";

export const debugPrint = debug("akane0-core");

export const rootPath = path.resolve(path.join(__dirname, ".."));
export const varPath = path.join(rootPath, "./var");
export const mainDatabasePath = path.join(varPath, "./main.sqlite3");
export const adaptersPath = path.join(rootPath, "./adapters");
export const behaviorsPath = path.join(rootPath, "./behaviors");

export let appDataSource: DataSource;
const adapters: Array<AkaneAdapter> = [];
const behaviors: Array<AkaneBehavior> = [];

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
  const neoAdapters = await installPlugins(CORE_ADAPTERS, adapterResolver);
  for (const adapter of neoAdapters) {
    adapters.push(adapter);
  }
}

async function installBehaviors() {
  const neoBehaviors = await installPlugins(CORE_BEHAVIORS, behaviorResolver);
  for (const behavior of neoBehaviors) {
    behaviors.push(behavior);
  }
}

async function setupDatabase() {
  appDataSource = new DataSource({
    type: "better-sqlite3",
    database: mainDatabasePath,
    entities: [`${__dirname}/entity/**/*.{ts,js}`],
    synchronize: true,
  });
  await appDataSource.initialize();
  await initMasterIdentity();
}

async function startAdapters() {
  const startupTasks = Promise.allSettled(
    adapters.map((adapter) => adapter.start())
  );
  await startupTasks;
}

async function startBehaviors() {
  const startupTasks = Promise.allSettled(
    behaviors.map((behavior) => behavior.start())
  );
  await startupTasks;
}

function stopAdapters() {
  adapters.map((adapter) => adapter.stop());
}

function stopBehaviors() {
  behaviors.map((behavior) => behavior.stop());
}

function stopDatabase() {
  appDataSource.destroy();
}

async function bootstrap() {
  printDebugInfo();
  await ensureDirs();

  await installAdapters();
  await installBehaviors();

  await setupDatabase();

  await startAdapters();
  await startBehaviors();
}
bootstrap();

registerCleanUpHandler(function (exitCode, signal) {
  debugPrint("performing clean-up and exiting.", { exitCode, signal });
  stopAdapters();
  stopBehaviors();
  stopDatabase();
});
