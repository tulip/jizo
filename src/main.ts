// Environment Variables
const COMPONENT_PREFIX = "cc";
const LOAD_CLASS = `.${COMPONENT_PREFIX}-load`;
import Registry from "./registry";

import { GlobalStyles, WindowWatcher } from "@utils";
import { FilePickerChangedEventDetail } from "@components/Global/FilePicker/types";
import { axeReportHandler } from "@jizo/AxeReporter/axe-report-handler";
import { SitemapAlert } from "@jizo/Sitemap/sitemap-alert";

import "@utils/string";

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

const REGISTRY = new Registry(COMPONENT_PREFIX);
globalThis.Registry = REGISTRY;
globalThis.Listeners = {
  loadListeners: async () => {
    return new Promise(resolve => {
      if (document.getElementById("axe__create-report")) {
        document.getElementById("axe__create-report")!.removeEventListener("submit", axeReportHandler.handleCreateAxeReport);
        document.getElementById("axe__create-report")!.addEventListener("submit", axeReportHandler.handleCreateAxeReport);
      };

      if (document.getElementById("url__create-report")) {
        document.getElementById("url__create-report")!.removeEventListener("submit", axeReportHandler.handleCreateUrlList);
        document.getElementById("url__create-report")!.addEventListener("submit", axeReportHandler.handleCreateUrlList);
      };

      resolve(true);
    })
  }
}

document.addEventListener("filePickerChanged", async (event) => {
  const details = (
    event as CustomEvent<String, FilePickerChangedEventDetail>
  ).detail as unknown as FilePickerChangedEventDetail;
  const file = details.files[0];

  if (details.action === "create-bulk-axe-report") {
    await window.jizo.createBulkAxeReport(file.path);
  }
});

window.electron.ipcRenderer.on("report-created", (_: any, details: any) => {
  switch (details.type.toLowerCase()) {
    case "axe-report":
      axeReportHandler.handleReportCreated("axe__create-report");
      break;
    case "url-list":
      axeReportHandler.handleReportCreated("url__create-report");
      break;
  }
});

window.electron.ipcRenderer.on("sitemap-found", (_: any, details: any) => {
  SitemapAlert.handleSitemapFound(details);
});

window.electron.ipcRenderer.on("update-node-output", (_: any, output: string) => {
  document.dispatchEvent(new CustomEvent("update-node-output", { detail: output }));
});

export {};
