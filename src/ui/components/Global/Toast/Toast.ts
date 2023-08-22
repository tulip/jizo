import { DomHelpers } from "@utils";

export default class Toast extends HTMLElement {
  label: string | undefined;
  message: string | undefined;
  type: string | undefined;
  position: string | undefined;
  slots: NodeList | undefined;

  constructor() {
    super();

    this.label = undefined;
    this.message = undefined;
    this.type = undefined;
    this.position = undefined;
    this.slots = this.querySelectorAll("[slot]");
  }

  private async spawn() {
    this.querySelector(':scope > article')!.classList.remove('despawn');
    this.querySelector(':scope > article')!.classList.add('spawn');
  }

  private async despawn() {
    this.querySelector(':scope > article')!.classList.remove('spawn');
    this.querySelector(':scope > article')!.classList.add('despawn');
  }

  connectedCallback() {
    let classStr = "cc-toast";
    this.slots = this.querySelectorAll("[slot]");
    this.type = this.dataset.type;
    this.position = this.dataset.position;

    if (this.type) {
      classStr = `${classStr} cc-toast__${this.type}`;
    }

    if (this.position) {
      classStr = `${classStr} ${this.position}`;
    }

    this.innerHTML = this.template;

    Array.from(this.slots as NodeList).forEach((slot: Node) => {
      this.querySelector(
        `slot[name="${(slot as HTMLElement).getAttribute("slot")}"]`
      )!.replaceWith(slot);
    });

    this.querySelector(":scope > article")!.setAttribute(
      "class",
      `cc-toast${this.type ? ` cc-toast__${this.type}` : ''}${
        this.position ? ` ${this.position}` : ''
      }`
    );

    DomHelpers.loadComponent(this);
    this.spawn();

    setTimeout(() => {
      this.despawn();

      setTimeout(() => {
        this.remove();
      }, 325);
    }, 5000);
  }

  private template = `
    <article>
      <slot name="label"></slot>
      <slot name="msg"></slot>
    </article>
  `;
}
