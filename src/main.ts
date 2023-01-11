// Environment Variables
const COMPONENT_PREFIX = "cc";
const LOAD_CLASS = `.${COMPONENT_PREFIX}-load`;

import "@utils/string.ts";

import { GlobalStyles, WindowWatcher } from "@utils";

const WatcherOpts = {
  threshold: 0.1,
  rootMargin: `${GlobalStyles.gutters["gutter__lg"]}`,
};

WindowWatcher(WatcherOpts, LOAD_CLASS);

if (document.getElementById("toggle-theme")) {
  await import("@components/Global/ToggleDarkMode").then((module) => {
    const initToggle = module.default;
    initToggle(document.getElementById("toggle-theme")!);
  });
}

const loadModules = () => {
  return new Promise(async (resolve) => {
    const _REGISTRY_: Array<CustomElementConstructor> = [];

    if (document.querySelectorAll(`${COMPONENT_PREFIX}-card-basic`).length) {
      await import("@components/Cards/CardBasic").then((module) => {
        _REGISTRY_.push(module.default);
      });
    }

    if (document.querySelectorAll(`${COMPONENT_PREFIX}-file-picker`).length) {
      await import("@components/Global/FilePicker").then((module) => {
        _REGISTRY_.push(module.default);
      });
    }

    if (document.querySelectorAll(`${COMPONENT_PREFIX}-dropdown`).length) {
      await import("@components/Dropdowns/Dropdown").then((module) => {
        _REGISTRY_.push(module.default);
      });
    }

    if (document.querySelectorAll(`${COMPONENT_PREFIX}-slide`).length) {
      await import("@components/Slider/Slide").then((module) => {
        _REGISTRY_.push(module.default);
      });
    }

    if (document.querySelectorAll(`${COMPONENT_PREFIX}-slider`).length) {
      await import("@components/Slider/Slider").then((module) => {
        _REGISTRY_.push(module.default);
      });
    }

    if (
      document.querySelectorAll(`${COMPONENT_PREFIX}-axe-report-viewer`).length
    ) {
      await import("@components/Panels/AxeReportViewer").then((module) => {
        _REGISTRY_.push(module.default);
      });
    }

    resolve(_REGISTRY_);
  });
};

const initModules = (registry: Array<CustomElementConstructor>) => {
  (registry as Array<CustomElementConstructor>).forEach((item) => {
    if (!customElements.get(`${COMPONENT_PREFIX}-${item.name.toKebabCase()}`)) {
      customElements.define(
        `${COMPONENT_PREFIX}-${item.name.toKebabCase()}`,
        item
      );
    }
  });
};

globalThis.LoadModules = loadModules;
globalThis.InitModules = initModules;

loadModules().then((registry) => {
  initModules(registry as Array<CustomElementConstructor>);
});

export {};
