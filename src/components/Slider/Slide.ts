import { DomHelpers } from "@utils";

export default class Slide extends HTMLElement {
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
        slotName!.toLowerCase() === "body" &&
        DomHelpers.isDivElement(slot) === false
      ) {
        throw new Error('Slot `<slot="body">` must be a DIV element.');
      }

      this.querySelector(
        `slot[name="${slot.getAttribute("slot")}"]`
      )!.replaceWith(slot);
    });

    children.length &&
      children.forEach((child) =>
        this.querySelector(":scope > .cc-slide")?.appendChild(child)
      );
  }

  render() {
    this.clone();
  }

  connectedCallback() {
    DomHelpers.loadComponent(this);
  }

  private template = `
    <div class="cc-slide">
    </div>
  `;
}
