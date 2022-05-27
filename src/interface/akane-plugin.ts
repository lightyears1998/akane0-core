export type PluginType = "adapter" | "behavior";

export interface AkanePlugin {
  id: string;
  type: PluginType;
  version: string;

  start: () => Promise<void>;
  stop: () => void;
}
