export interface AkaneAdapter {
  id: string;
  version: string;

  init: Promise<AkaneAdapter>;
  finalize: Promise<void>;
  start: Promise<void>;
  stop: Promise<void>
}
