export const axeReportHandler = {
  handleCreateAxeReport: async (event: SubmitEvent) => {
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

    await window.axeApi.createAxeReport(vals[0], vals[1]);
  },
  handleCreateUrlList: async (event: SubmitEvent) => {
    event.preventDefault();

    // URL is required
    if (
      !(document.getElementById("url__report-target") as HTMLInputElement).value
        .length
    ) {
      throw new Error("url__create-url-list: a URL is required !");
    }

    const inputs = (event.target as HTMLElement)!.querySelectorAll("input");
    const vals: Array<string> = [];
    inputs.forEach((input) => {
      input.setAttribute("disabled", "true");
      vals.push(input.value);
    });
    document
      .getElementById("url__report-submit")
      ?.setAttribute("disabled", "true");


    await window.axeApi.createUrlList(vals[0], vals[1]);
  },
  handleReportCreated: (formId: string) => {
    const form = document.getElementById(formId);
    if (!form) { return; }
    form.querySelector('button[type="submit"]')?.removeAttribute("disabled");

    const toast = document.createElement("cc-toast");
    toast.setAttribute("data-type", "success");
    toast.setAttribute("data-position", "top");

    const msg = document.createElement("p");
    msg.setAttribute("class", "cc-toast__msg text-center");
    msg.setAttribute("slot", "msg");
    msg.textContent =
      "Your report has been successfully generated and saved in the output directory configured in your environment variables.";

    toast.appendChild(msg);
    document.getElementById("main-content")?.appendChild(toast);

    globalThis.Registry.loadModules().then((registry: Array<CustomElementConstructor>) => {
      globalThis.Registry.registry = registry;
      globalThis.Registry.initRegistry();
    });

    const inputs = form.querySelectorAll("input");
    inputs &&
      inputs.forEach((input) => {
        input.removeAttribute("disabled");
      });
  },
};
