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

    if (document.querySelectorAll(`${COMPONENT_PREFIX}-button-basic`).length) {
      await import("@components/Buttons/ButtonBasic").then((module) => {
        _REGISTRY_.push(module.default);
      });
    }

    if (document.querySelectorAll(`${COMPONENT_PREFIX}-file-picker`).length) {
      await import("@components/Global/FilePicker/FilePicker").then((module) => {
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

    if (document.querySelectorAll(`${COMPONENT_PREFIX}-modal`).length) {
      await import("@components/Modal/Modal").then((module) => {
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

document.getElementById('axe__create-report')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  // URL is required
  if (!(document.getElementById('axe__report-target') as HTMLInputElement).value.length) {
    throw new Error('axe__create-report: a URL is required !');
  }

  const inputs = (event.target as HTMLElement)!.querySelectorAll('input');
  const vals:Array<string> = [];
  inputs.forEach((input) => { vals.push(input.value); });
  document.getElementById('axe__report-submit')?.setAttribute('disabled', 'true');

  await window.axeApi.createReport(vals[0], vals[1]);

  window.electron.ipcRenderer.on('report-created', () => {
    document.getElementById('axe__report-submit')?.removeAttribute('disabled');
  });
});

export { };
