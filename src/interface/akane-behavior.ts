import { AkanePlugin } from "./akane-plugin";

export interface AkaneBehavior extends AkanePlugin {
  id: string;
  version: string;

  start: () => Promise<void>;
  stop: () => void;
}
