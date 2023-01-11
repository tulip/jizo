import { DomHelpers } from "@utils";
import "@styles/components/dropdowns/dropdown.scss";

export default class Dropdown extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  private clone() {
    const slots = this.querySelectorAll("[slot]");
    const children = Array.from(this.children).filter(
      (child) => !child.getAttribute("slot")
    );
    this.innerHTML = this.template;

    slots.forEach((slot: Element) => {
      const slotName = slot.getAttribute("slot");

      if (
        slotName!.toLowerCase() === "label" &&
        DomHelpers.isTypeof(slot, "span") === false
      ) {
        throw new Error('Slot `<slot="label">` must be a SPAN element.');
      }

      this.querySelector(
        `slot[name="${slot.getAttribute("slot")}"]`
      )!.replaceWith(slot);
    });

    children.forEach((child: Element) => {
      this.querySelector(":scope > details")!.appendChild(child);
    });
  }

  render() {
    this.clone();
  }

  connectedCallback() {
    DomHelpers.loadComponent(this);
  }

  private template = `
    <details class="cc-dropdown">
      <summary class="dropdown-label"><slot name="label"></slot></summary>
    </details>
  `;
}
