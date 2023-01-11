import { DomHelpers } from "@utils";
import "@styles/components/cards/basic-card.scss";

export default class CardBasic extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  private clone() {
    const slots = this.querySelectorAll("[slot]");
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
  }

  render() {
    this.clone();
  }

  connectedCallback() {
    DomHelpers.loadComponent(this);
  }

  private template = `
    <div class="cc-basic-card">
      <slot name="heading"></slot>
      <slot name="body"></slot>
      <slot name="footer></slot>
    </div>
  `;
}
