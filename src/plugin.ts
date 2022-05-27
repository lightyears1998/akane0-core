import { sync as resolveNodeModule } from "resolve";

import { pluginPath } from "./app";
import { AkanePlugin } from "./interface";

export type PluginType = "adapter" | "behavior";

export type PluginNameResolver = (pluginName: string) => string;

export async function installPlugins(
  pluginNameList: Record<PluginType, string[]>
) {
  const installedPlugins: Array<AkanePlugin> = [];

  const realPluginNames: string[] = [];
  const { adapter, behavior } = pluginNameList;
  for (const name of adapter) {
    realPluginNames.push(`./akane0-adapter-${name}`);
  }
  for (const name of behavior) {
    realPluginNames.push(`./akane0-behavior-${name}`);
  }

  for (const pluginName of realPluginNames) {
    const plugin = await installPlugin(pluginName);
    if (plugin) {
      installedPlugins.push(plugin);
    }
  }

  return installedPlugins;
}

export async function installPlugin(
  pluginName: string
): Promise<AkanePlugin | undefined> {
  let pluginConstructor;
  try {
    const pluginLibPath = resolvePlugin(pluginName);
    pluginConstructor = (await import(pluginLibPath)).default;
  } catch {
    console.error(`Can't find plugin named ${pluginName}.`);
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

export function resolvePlugin(pluginName: string): string {
  return resolveNodeModule(pluginName, { basedir: pluginPath });
}
