import { sync as resolve } from "resolve";

import { adaptersPath } from "./app";

export function resolveAdapter(adapterName: string): string {
  const prefix = "./akane0-adapter-";
  const realPluginName = `${prefix}${adapterName}`;
  return resolvePlugin(adaptersPath, realPluginName);
}

export function resolvePlugin(basedir: string, pluginName: string): string {
  return resolve(pluginName, { basedir: basedir });
}
