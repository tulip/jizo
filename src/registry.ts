// this file contains the CustomElementRegistry
//
// for more information, take a look here --
// https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry

export default class Registry {
  prefix: string = "cc";
  registry: Array<CustomElementConstructor> = [];

  constructor(prefix?: string) {
    prefix && (this.prefix = prefix);

    this.init();
  }

  loadModules = async (): Promise<Array<CustomElementConstructor>> => {
    return new Promise(async (resolve) => {
      const registry: Array<CustomElementConstructor> = [];

      if (document.querySelectorAll(`${this.prefix}-card-basic`).length) {
        await import("@components/Cards/CardBasic").then((module) => {
          registry.push(module.default);
        });
      }

      if (
        document.querySelectorAll(`${this.prefix}-button-basic`).length
      ) {
        await import("@components/Buttons/ButtonBasic").then((module) => {
          registry.push(module.default);
        });
      }

      if (document.querySelectorAll(`${this.prefix}-file-picker`).length) {
        await import("@components/Global/FilePicker/FilePicker").then(
          (module) => {
            registry.push(module.default);
          }
        );
      }

      if (document.querySelectorAll(`${this.prefix}-dropdown`).length) {
        await import("@components/Dropdowns/Dropdown").then((module) => {
          registry.push(module.default);
        });
      }

      if (document.querySelectorAll(`${this.prefix}-slide`).length) {
        await import("@components/Slider/Slide").then((module) => {
          registry.push(module.default);
        });
      }

      if (document.querySelectorAll(`${this.prefix}-slider`).length) {
        await import("@components/Slider/Slider").then((module) => {
          registry.push(module.default);
        });
      }

      if (
        document.querySelectorAll(`${this.prefix}-axe-report-viewer`)
          .length
      ) {
        await import("@components/Panels/AxeReportViewer").then((module) => {
          registry.push(module.default);
        });
      }

      if (document.querySelectorAll(`${this.prefix}-modal`).length) {
        await import("@components/Modal/Modal").then((module) => {
          registry.push(module.default);
        });
      }

      if (document.querySelectorAll(`${this.prefix}-toast`).length) {
        await import("@components/Global/Toast/Toast").then((module) => {
          registry.push(module.default);
        });
      }

      if (document.querySelectorAll(`${this.prefix}-alert`).length) {
        await import("@components/Modal/Alert").then((module) => {
          registry.push(module.default);
        });
      }

      if (document.querySelectorAll(`${this.prefix}-node-js-panel`).length) {
        await import("@components/Panels/NodeViewer").then((module) => {
          registry.push(module.default);
        });
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

  update = () => {
    this.loadModules().then((registry) => {
      this.registry = registry;
      this.initRegistry();
    });
  };

  init = async () => {
    this.loadModules().then((registry) => {
      this.registry = registry;
      this.initRegistry();
    });
  }

  get = (name: string) => {
    console.log(this.registry.find((item) => item.name === 'FilePicker'));
    return this.registry.find((item) => item.name === name);
  };
}
