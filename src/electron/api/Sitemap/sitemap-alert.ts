import { AlertDismissedEventDetail } from "@components/Modal/types";

const SELECTORS = {
  'axe-report': 'axe__create-report',
  'url-list': 'url__create-report',
};
let SITEMAP = '';
let SELECTOR = '';

const handleAlertDismiss = async (event: Event) => {
  const details = (event as CustomEvent<String, AlertDismissedEventDetail>)
    .detail as unknown as AlertDismissedEventDetail;
  if (details.action === "resumeReport") {
    const form = document.getElementById(
      SELECTOR
    ) as HTMLFormElement;
    const inputs = form!.querySelectorAll("input");
    const vals: Array<string> = [];

    inputs.forEach((input) => {
      input.setAttribute("disabled", "true");
      vals.push(input.value);
    });
    form
      .querySelector("button[type='submit']")
      ?.setAttribute("disabled", "true");

    window.axeApi.resumeReport(vals[0], vals[1]);
    document.removeEventListener("alertDismissed", handleAlertDismiss);
  }
}

const handleAlertAction = async (event: Event) => {
  const details = (event as CustomEvent<String, AlertDismissedEventDetail>)
    .detail as unknown as AlertDismissedEventDetail;
  if (details.action === "createSitemapCsv") {
    const form = document.getElementById(
      SELECTOR
    ) as HTMLFormElement;
    const inputs = form!.querySelectorAll("input");
    const vals: Array<string> = [];

    inputs.forEach((input) => {
      input.setAttribute("disabled", "true");
      vals.push(input.value);
    });

    const shouldResumeReport = SELECTOR === "url__create-report" ? false : true;

    window.axeApi.createSitemapCsv(SITEMAP, vals[0], vals[1], shouldResumeReport);
  };
  document.removeEventListener("alertAction", handleAlertAction);
}

export const SitemapAlert = {
  handleAlertDismiss: handleAlertDismiss,
  handleSitemapFound: async (details: any) => {
    SITEMAP = details.sm;
    SELECTOR = SELECTORS[details.type as keyof typeof SELECTORS];
    const sitemapAlert = document.createElement("cc-alert");

    const alertContent = document.createElement("p");
    alertContent.classList.add("text-center");
    alertContent.setAttribute("slot", "content");
    alertContent.textContent = 'We were able to locate a sitemap for this URL! Would you like us to save this sitemap in CSV format?';

    const alertDismiss = document.createElement("button");
    alertDismiss.setAttribute("class", "btn__rounded btn__dismiss");
    alertDismiss.setAttribute("slot", "dismiss");
    alertDismiss.setAttribute("data-action", "resumeReport");
    alertDismiss.textContent = "No thank you!";

    const alertAction = document.createElement("button");
    alertAction.setAttribute("class", "btn__rounded btn__action");
    alertAction.setAttribute("slot", "action");
    alertAction.setAttribute("data-action", "createSitemapCsv");
    alertAction.textContent = "Sure!";

    sitemapAlert.appendChild(alertContent);
    sitemapAlert.appendChild(alertDismiss);
    sitemapAlert.appendChild(alertAction);
    document.body.appendChild(sitemapAlert);

    globalThis.Registry.update();

    sitemapAlert.setAttribute("open", "true");

    document.addEventListener("alertDismissed", handleAlertDismiss);
    document.addEventListener("alertAction", handleAlertAction);
  },
};
