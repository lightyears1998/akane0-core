export interface AkanePlugin {
  id: string;
  version: string;

  start: () => Promise<void>;
  stop: () => void;
}
