/// <reference types="vite/client" />

declare global {
  var Watcher: InterfaceObserver;
  var StaticRouter: StaticRouter;
  var Registry: Registry;
  var Listeners: Listeners;
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
