import { DomHelpers } from "@utils";

const FilePickerChangedEvent = new CustomEvent("filePickerChanged", {
  detail: {
    type: "FilePickerChanged",
    files: null,
  },
});

export default class FilePicker extends HTMLElement {
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

  connectedCallback() {
    DomHelpers.loadComponent(this);

    this.querySelector("input")?.addEventListener("change", (event: Event) => {
      if (!(event.target instanceof HTMLInputElement)) return;

      let files: FileList = <FileList>(<HTMLInputElement>event.target).files;

      if (files.item.length !== 1) {
        this.querySelector("span")!.textContent =
          "Please select only a singular report.";
        return;
      }
      if (files.item(0)!.type.toLowerCase() !== "application/json") {
        this.querySelector("span")!.textContent =
          "Please select only a singular report.";
        return;
      }

      this.querySelector("span")!.textContent = files.item(0)!.name;
      FilePickerChangedEvent.detail.files = files;
      document.dispatchEvent(FilePickerChangedEvent);
    });
  }

  private template = `
    <form class="cc-file-picker" id="cc-file-picker-${this.id}">
      <label for="file-picker-${this.id}" class="btn__rounded">
        Upload report
        <input id="file-picker-${this.id}" type="file" hidden />
      </label>
      <span class="ml-4 p-2">No file selected</span>
    </form>
  `;
}
