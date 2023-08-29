// this file contains the CustomElementRegistry
//
// for more information, take a look here --
// https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry

export default class Registry {
  prefix: string;
  registry: Array<CustomElementConstructor> = [];

  constructor(prefix: string) {
    this.prefix = prefix;

    this.init();
  }

  loadModules = async (): Promise<Array<CustomElementConstructor>> => {
    return new Promise(async (resolve) => {
      const registry: Array<CustomElementConstructor> = [];

      if (document.querySelectorAll(`${this.prefix}-card-basic`).length) {
        if (!this.registry.filter((item) => item.name === "CardBasic").length) {
          await import("@components/Cards/CardBasic").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-button-basic`).length) {
        if (
          !this.registry.filter((item) => item.name === "ButtonBasic").length
        ) {
          await import("@components/Buttons/ButtonBasic").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-file-picker`).length) {
        if (
          !this.registry.filter((item) => item.name === "FilePicker").length
        ) {
          await import("@components/Global/FilePicker/FilePicker").then(
            (module) => {
              registry.push(module.default);
            }
          );
        }
      }

      if (document.querySelectorAll(`${this.prefix}-dropdown`).length) {
        if (!this.registry.filter((item) => item.name === "Dropdown").length) {
          await import("@components/Dropdowns/Dropdown").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-slide`).length) {
        if (!this.registry.filter((item) => item.name === "Slide").length) {
          await import("@components/Slider/Slide").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-slider`).length) {
        if (!this.registry.filter((item) => item.name === "Slider").length) {
          await import("@components/Slider/Slider").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (
        document.querySelectorAll(`${this.prefix}-axe-report-viewer`).length
      ) {
        if (
          !this.registry.filter((item) => item.name === "AxeReportViewer")
            .length
        ) {
          await import("@components/Panels/AxeReportViewer/AxeReportViewer").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-modal`).length) {
        if (!this.registry.filter((item) => item.name === "Modal").length) {
          await import("@components/Modal/Modal").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-toast`).length) {
        if (!this.registry.filter((item) => item.name === "Toast").length) {
          await import("@components/Global/Toast/Toast").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-alert`).length) {
        if (!this.registry.filter((item) => item.name === "Alert").length) {
          await import("@components/Modal/Alert").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-node-js-panel`).length) {
        if (
          !this.registry.filter((item) => item.name === "NodeJsPanel").length
        ) {
          await import("@components/Panels/NodeViewer").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-static-router`).length) {
        if (
          !this.registry.filter((item) => item.name === "StaticRouter").length
        ) {
          await import("@components/Panels/StaticRouter/StaticRouter").then((module) => {
            registry.push(module.default);
          });
        }
      }

      if (document.querySelectorAll(`${this.prefix}-link`).length) {
        if (
          !this.registry.filter((item) => item.name === "Link").length
        ) {
          await import("@components/Links/Link").then((module) => {
            registry.push(module.default);
          });
        }
      }

      resolve(registry);
    });
  };

  initRegistry = () => {
    this.registry.forEach((item) => {
      if (!customElements.get(`${this.prefix}-${item.name.toKebabCase()}`)) {
        customElements.define(
          `${this.prefix}-${item.name.toKebabCase()}`,
          item
        );
      }
    });
  };

  update = async () => {
    await this.init();
  };

  init = async () => {
    this.loadModules().then((registry) => {
      this.registry = registry;
      this.initRegistry();
    });
  };

  get = (name: string) => {
    return this.registry.find((item) => item.name === name);
  };
}
