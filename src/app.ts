import "reflect-metadata";
import path from "path";

import fs from "fs-extra";
import debug from "debug";
import registerCleanUpHandler from "node-cleanup";
import { DataSource } from "typeorm";

import { CORE_ADAPTERS, CORE_BEHAVIORS } from "./config";
import { installPlugins } from "./plugin";
import { AkanePlugin } from "./interface";
import { initMasterIdentity } from "./entity";

export const debugPrint = debug("akane0-core");

export const rootPath = path.resolve(path.join(__dirname, ".."));
export const pluginPath = path.join(rootPath, "./plugins");
export const varPath = path.join(rootPath, "./var");
export const mainDatabasePath = path.join(varPath, "./main.sqlite3");
export const adaptersPath = path.join(rootPath, "./adapters");
export const behaviorsPath = path.join(rootPath, "./behaviors");

export let appDataSource: DataSource;
const plugins: Array<AkanePlugin> = [];

function printDebugInfo() {
  const parameters = { ADAPTERS: CORE_ADAPTERS };
  debugPrint("parameters", parameters);
}

async function ensureDirs() {
  for (const path of [varPath, adaptersPath, behaviorsPath]) {
    await fs.ensureDir(path);
  }
}

async function initPlugins() {
  const neoPlugins = await installPlugins({
    adapter: CORE_ADAPTERS,
    behavior: CORE_BEHAVIORS,
  });
  for (const plugin of neoPlugins) {
    plugins.push(plugin);
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

  debugPrint("");
}

async function startPlugins() {
  const startupTasks = Promise.allSettled(
    plugins.map((plugin) => plugin.start())
  );
  await startupTasks;
}

function stopPlugins() {
  plugins.map((plugin) => plugin.stop());
}

function disconnectDatabase() {
  appDataSource.destroy();
}

async function bootstrap() {
  printDebugInfo();
  await ensureDirs();

  await setupDatabase();

  await initPlugins();
  await startPlugins();
}
bootstrap();

registerCleanUpHandler(function (exitCode, signal) {
  debugPrint("performing clean-up and exiting.", { exitCode, signal });
  stopPlugins();
  disconnectDatabase();
});
