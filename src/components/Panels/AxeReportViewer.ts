import { DomHelpers } from "@utils";
import "@styles/components/panels/report-viewer.scss";

type FilePickerChangedEventDetail = {
  type: string;
  files: FileList;
};

export default class AxeReportViewer extends HTMLElement {
  constructor() {
    super();

    this.render();
    this.id = crypto.randomUUID();
  }

  private clone() {
    this.innerHTML = this.template;
  }

  render() {
    this.clone();
  }

  drawReport(jsonString: string) {
    const jsonObj = JSON.parse(jsonString)[0];
    const wrapper = this.querySelector("section");
    wrapper!.textContent = "";

    const roots = this.parseJsonObject(jsonObj);

    roots.map((root) => {
      if (root) wrapper?.appendChild(root);
    });

    globalThis
      .LoadModules()
      .then((registry: Array<CustomElementConstructor>) => {
        globalThis.InitModules(registry);
      });
  }

  parseJsonObject(obj: any) {
    const { url, timestamp, violations } = obj;

    const urlElement = document.createElement("div");
    const urlH2 = document.createElement("h2");
    urlH2.textContent = "URL: ";
    const urlSpan = document.createElement("span");
    urlSpan.textContent = url;
    urlSpan.setAttribute("class", "pl-3");
    urlElement.appendChild(urlH2);
    urlElement.appendChild(urlSpan);
    urlElement.setAttribute("class", "mb-4 d-flex align-items-center");

    const timestampElement = document.createElement("div");
    const timestampH2 = document.createElement("h2");
    timestampH2.textContent = "Date Captured: ";
    const timestampSpan = document.createElement("span");
    timestampSpan.textContent = timestamp;
    timestampSpan.setAttribute("class", "pl-3");
    timestampElement.appendChild(timestampH2);
    timestampElement.appendChild(timestampSpan);
    timestampElement.setAttribute("class", "mb-4 d-flex align-items-center");

    const violationsElement = document.createElement("div");
    const violationsH2 = document.createElement("h2");
    violationsH2.textContent = "Violations: ";
    const violationsSpan = document.createElement("span");
    violationsSpan.textContent = violations.length;
    violationsSpan.setAttribute("class", "pl-3");
    violationsElement.appendChild(violationsH2);
    violationsElement.appendChild(violationsSpan);
    violationsElement.setAttribute("class", "mb-5 d-flex align-items-center");

    const violationsDetails = document.createElement("div");
    this.formatViolations(violations).forEach((violation) => {
      violationsDetails.appendChild(violation);
    });

    return [urlElement, timestampElement, violationsElement, violationsDetails];
  }

  makeDetailsRow = (key: HTMLElement, val: HTMLElement) => {
    const row = document.createElement("div");
    row.setAttribute("class", "d-flex align-items-start");
    row.appendChild(key.cloneNode(true));
    row.appendChild(val.cloneNode(true));

    return row;
  };

  formatViolations(violations: Array<any>) {
    const formatted: Array<any> = [];

    violations.forEach((violation) => {
      const deets = document.createElement("cc-dropdown");
      deets.classList.add("cc-load");

      const slot = document.createElement("span");
      slot.setAttribute("slot", "label");
      slot.textContent = `Violation ID: #${violation.id}`;

      let deetsH4 = document.createElement("h4");
      let deetsInfo = document.createElement("span");

      deetsH4.textContent = "Description:";
      deetsInfo.textContent = violation.help;
      const row1 = this.makeDetailsRow(deetsH4, deetsInfo);

      deetsH4.textContent = "Info:";
      deetsInfo.textContent = violation.description;
      const row2 = this.makeDetailsRow(deetsH4, deetsInfo);

      deetsH4.textContent = "Severity:";
      deetsInfo.textContent = violation.impact;
      const row3 = this.makeDetailsRow(deetsH4, deetsInfo);

      deetsH4.textContent = "Help URL:";
      const deetsLink = document.createElement("a");
      deetsLink.setAttribute("href", violation.helpUrl);
      deetsLink.setAttribute("target", "_blank");
      deetsLink.textContent = violation.helpUrl;
      const row4 = this.makeDetailsRow(deetsH4, deetsLink);

      deets.appendChild(slot);
      deets.appendChild(row1);
      deets.appendChild(row2);
      deets.appendChild(row3);
      deets.appendChild(row4);

      if (violation.nodes.length) {
        const violationEle = this.formatNodes(violation.nodes);
        deets.appendChild(violationEle);
        globalThis
          .LoadModules()
          .then((registry: Array<CustomElementConstructor>) => {
            globalThis.InitModules(registry);
          });
      }

      formatted.push(deets);
    });

    return formatted;
  }

  formatNodes(nodes: Array<any>) {
    const makeSlide = (slideData: any, index: number) => {
      const slide = document.createElement("cc-slide");

      const slideH4 = document.createElement("h4");
      slideH4.setAttribute("class", "mb-3 text-no-wrap");
      slideH4.textContent = `Node #${index++}`;

      const slideFailure = document.createElement("p");
      slideFailure.setAttribute("class", "mb-3");
      slideFailure.textContent = slideData.failureSummary;

      let rowH5 = document.createElement("h5");
      rowH5.setAttribute("class", "text-no-wrap pr-2");
      let rowSpan = document.createElement("span");
      let rowCode = document.createElement("code");

      rowH5.textContent = "CSS Selector:";
      rowCode.textContent = slideData.target[0];
      rowSpan.appendChild(rowCode);
      const row1 = this.makeDetailsRow(rowH5, rowSpan);
      row1.classList.add("mb-3");

      rowH5.textContent = "HTML Element:";
      rowCode.textContent = slideData.html;
      rowSpan.appendChild(rowCode);
      const row2 = this.makeDetailsRow(rowH5, rowSpan);

      slide.appendChild(slideH4);
      slide.appendChild(slideFailure);
      slide.appendChild(row1);
      slide.appendChild(row2);

      return slide;
    };

    // TODO: replace with slider once built
    const slider = document.createElement("cc-slider");

    if (nodes.length === 1) {
      return makeSlide(nodes[0], 0);
    } else {
      nodes.forEach((node, index) => {
        slider.appendChild(makeSlide(node, index + 1));
      });
    }

    return slider;
  }

  connectedCallback() {
    DomHelpers.loadComponent(this);

    document.addEventListener("filePickerChanged", (event) => {
      const details = (
        event as CustomEvent<String, FilePickerChangedEventDetail>
      ).detail as unknown as FilePickerChangedEventDetail;
      const file = details.files[0];

      if (file !== null) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const jsonString = event.target?.result;
          this.drawReport(jsonString as string);
        };
        reader.readAsText(file);
      }
    });
  }

  private template = `
    <section id="report-viewer-${this.id}" aria-label="Axe Report Viewer" class="cc-report-viewer__axe py-3 pr-3">
      The contents of your report will be displayed here...
    <section>
  `;
}
