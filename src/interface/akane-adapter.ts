import { AkanePlugin } from "./akane-plugin";

export interface AkaneAdapter extends AkanePlugin {
  id: string;
  version: string;

  start: () => Promise<void>;
  stop: () => void;
}
