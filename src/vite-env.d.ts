/// <reference types="vite/client" />

declare global {
  var Watcher: InterfaceObserver;
  var Registry: Registry;
  var jizo: Jizo;
  var electron: ElectronApi;

  interface String {
    toKebabCase(): string;
    toCamelCase(separator?: string): string;
  }

  interface CustomEvent<Detail> {
    detail: Detail;
  }
}

export {};
