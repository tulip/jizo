// Environment Variables
const COMPONENT_PREFIX = "cc";
const LOAD_CLASS = `.${COMPONENT_PREFIX}-load`;

import Registry from './registry';
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

// make new registry here -- remove load modules doo-doo
const REGISTRY = new Registry(COMPONENT_PREFIX);
globalThis.Registry = REGISTRY;

document
  .getElementById("axe__create-report")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // URL is required
    if (
      !(document.getElementById("axe__report-target") as HTMLInputElement).value
        .length
    ) {
      throw new Error("axe__create-report: a URL is required !");
    }

    const inputs = (event.target as HTMLElement)!.querySelectorAll("input");
    const vals: Array<string> = [];
    inputs.forEach((input) => {
      input.setAttribute("disabled", "true");
      vals.push(input.value);
    });
    document
      .getElementById("axe__report-submit")
      ?.setAttribute("disabled", "true");

    await window.axeApi.createReport(vals[0], vals[1]);
  });

  window.electron.ipcRenderer.on("report-created", () => {
    document
      .getElementById("axe__report-submit")
      ?.removeAttribute("disabled");

    const toast = document.createElement("cc-toast");
    toast.setAttribute("data-type", "success");
    toast.setAttribute("data-position", "top");

    const msg = document.createElement("p");
    msg.setAttribute("class", "cc-toast__msg text-center");
    msg.setAttribute("slot", "msg");
    msg.textContent =
      "Your report has been successfully generated and saved in the output directory configured in your environment variables.";

    toast.appendChild(msg);
    console.log(toast);
    document.getElementById("main-content")?.appendChild(toast);

    REGISTRY.loadModules().then((registry) => {
      REGISTRY.registry = registry;
      REGISTRY.initRegistry();
    });

    const inputs = document.getElementById('axe__create-report')?.querySelectorAll("input");
    inputs && inputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  });

export {};
