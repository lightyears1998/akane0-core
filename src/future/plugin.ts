export interface AkanePlugin {
  install(): void
  uninstall(): void
  handleEvent(): void
}
