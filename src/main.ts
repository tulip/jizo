// Environment Variables
const COMPONENT_PREFIX = "cc";
const LOAD_CLASS = `.${COMPONENT_PREFIX}-load`;
import Registry from "./registry";

import { axeReportHandler } from "./include/axeReportHandler";
import { sitemap } from "./include/sitemapAlert";
import { GlobalStyles, WindowWatcher } from "@utils";

import "@utils/string.ts";

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

document.getElementById("axe__create-report")?.addEventListener("submit", axeReportHandler.handleCreateAxeReport);
document.getElementById("url__create-report")?.addEventListener("submit", axeReportHandler.handleCreateUrlList);

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
  sitemap.handleSitemapFound(details);
});
window.electron.ipcRenderer.on("update-node-output", (_: any, output: string) => {
  document.dispatchEvent(new CustomEvent("update-node-output", { detail: output }));
});

export {};
