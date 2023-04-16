/// <reference types="vite/client" />

declare global {
  var Watcher: InterfaceObserver;
  var LoadModules: function();
  var InitModules: function(Array<CustomElementConstructor>);

  interface String {
    toKebabCase(): string;
    toCamelCase(separator?: string): string;
  }

  interface CustomEvent<Detail> {
    detail: Detail;
  }
}

export {};
