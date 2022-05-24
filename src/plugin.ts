import { sync as resolve } from "resolve";

import { adaptersPath, behaviorsPath } from "./app";
import { AkanePlugin } from "./interface";

export type PluginNameResolver = (pluginName: string) => string;

export async function installPlugins(
  pluginNameList: string[],
  pluginNameResolver: PluginNameResolver
) {
  const installedPlugins: Array<AkanePlugin> = [];

  for (const pluginName of pluginNameList) {
    const plugin = await installPlugin(pluginName, pluginNameResolver);
    if (plugin) {
      installedPlugins.push(plugin);
    }
  }

  return installedPlugins;
}

export async function installPlugin(
  pluginName: string,
  pluginNameResolver: PluginNameResolver
): Promise<AkanePlugin | undefined> {
  let pluginConstructor;
  try {
    const pluginLibPath = pluginNameResolver(pluginName);
    pluginConstructor = (await import(pluginLibPath)).default;
  } catch {
    console.error(`Can't find adapter named ${pluginName}.`);
    return;
  }

  try {
    const plugin = new pluginConstructor();
    return plugin;
  } catch (e) {
    console.error(`Error initializing plugin named ${pluginName}.`);
    console.error(e);
  }
}

export function adapterResolver(adapterName: string): string {
  const prefix = "./akane0-adapter-";
  const realPluginName = `${prefix}${adapterName}`;
  return resolvePlugin(adaptersPath, realPluginName);
}

export function behaviorResolver(behaviorName: string): string {
  const prefix = "./akane0-behavior-";
  const realPluginName = `${prefix}${behaviorName}`;
  return resolvePlugin(behaviorsPath, realPluginName);
}

export function resolvePlugin(basedir: string, pluginName: string): string {
  return resolve(pluginName, { basedir: basedir });
}
