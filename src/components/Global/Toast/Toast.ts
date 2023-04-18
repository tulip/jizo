import { DomHelpers } from "@utils";

export default class Toast extends HTMLElement {
  label: string | undefined;
  message: string | undefined;
  type: string | undefined;
  position: string | undefined;

  constructor() {
    super();

    this.label = undefined;
    this.message = undefined;
    this.type = this.dataset.type;
    this.position = this.dataset.position;

    this.render();
  }

  private clone() {
    const slots = this.querySelectorAll("[slot]");
    this.innerHTML = this.template;

    let classStr = "cc-toast";
    if (this.type) {
      classStr = `${classStr} cc-toast__${this.type}`;
    }
    if (this.position) {
      classStr = `${classStr} ${this.position}`;
    }
    this.querySelector(":scope > article")!.setAttribute(
      "class",
      `cc-toast${this.type ? ` cc-toast__${this.type}` : null}${
        this.position ? ` ${this.position}` : null
      }`
    );

    slots.forEach((slot: Element) => {
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
    setTimeout(() => {
      this.remove();
    }, 5000);
  }

  private template = `
    <article>
      <slot name="label"></slot>
      <slot name="msg"></slot>
    </article>
  `;
}
