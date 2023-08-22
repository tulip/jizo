import { DomHelpers } from "@utils";
import { FilePickerChangedEvent } from "./events";

const FILETYPES = {
  json: "application/json",
  csv: "text/csv",
};

export default class FilePicker extends HTMLElement {
  action: string | undefined;
  fileType: string | undefined;

  constructor() {
    super();

    this.id = crypto.randomUUID();
    this.fileType = this.dataset.fileType;
    this.action = this.dataset.action;
    this.render();

    this.handleFilePickerChanged = this.handleFilePickerChanged.bind(this);
  }

  private clone() {
    this.innerHTML = this.template;
  }

  private handleFilePickerChanged(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
      event.stopImmediatePropagation();

      let files: FileList = <FileList>(<HTMLInputElement>event.target).files;

      if (files.item.length !== 1) {
        this.querySelector("span")!.textContent =
          "Please select only a singular report.";
        return;
      }

      if (this.fileType) {
        if (files.item(0)!.type.toLowerCase() !== FILETYPES[this.fileType as keyof typeof FILETYPES]) {
          this.querySelector("span")!.textContent =
            `Only files of type: ${FILETYPES[this.fileType as keyof typeof FILETYPES]} are allowed!`;
          return;
        }
      };

      this.querySelector("span")!.textContent = files.item(0)!.name;
      const pickerChanged = FilePickerChangedEvent;
      pickerChanged.detail.action = this.action;
      pickerChanged.detail.files = files;
      document.dispatchEvent(pickerChanged);
  }

  protected render() {
    this.clone();
  }

  protected connectedCallback() {
    const id = this.querySelector('.cc-file-picker')?.getAttribute('id')?.replace('{{id}}', this.id)!;
    this.querySelector('.cc-file-picker')?.setAttribute('id', id);
    this.querySelector('label')?.setAttribute('for', id);
    this.querySelector('input')?.setAttribute('id', `${this.querySelector('input')?.getAttribute('id')!.replace('{{id}}', this.id)}`);
    DomHelpers.loadComponent(this);

    this.querySelector("input")?.addEventListener("change", this.handleFilePickerChanged);
    this.querySelector("label")?.addEventListener("click", (event) => {
      event?.stopImmediatePropagation();
      (event.target as HTMLElement).querySelector('input')?.click();
    });
  }

  private template = `
    <form class="cc-file-picker" id="cc-file-picker-{{id}}">
      <label for="file-picker-{{id}}" class="btn__rounded mr-0">
        Upload report
        <input id="file-picker-{{id}}" type="file" hidden />
      </label>
      <span class="p-2">No file selected</span>
    </form>
  `;
}
