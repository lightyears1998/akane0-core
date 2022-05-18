export interface AkaneAdapter {
  id: string;
  version: string;

  start: () => Promise<void>;
  stop: () => void;
}
