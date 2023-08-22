import { DomHelpers } from "@utils";
import "@styles/components/modal/modal.scss";

export default class Modal extends HTMLElement {
  trigger: HTMLElement | null;
  content: HTMLElement | null;

  constructor() {
    super();

    this.trigger = null;
    this.content = null;
    this.render();

    // bindings
    this.close = this.close.bind(this);
  }

  private clone() {
    const slots = this.querySelectorAll("[slot]");
    this.innerHTML = this.template;

    slots.forEach((slot: Element) => {
      const slotName = slot.getAttribute("slot");

      // trigger content must be span
      if (
        slotName!.toLowerCase() === "trigger" &&
        DomHelpers.isTypeof(slot, "span") === false
      ) {
        throw new Error('Slot `<slot="trigger">` must be a SPAN element.');
      }

      // content must be wrapped in div
      if (
        slotName!.toLowerCase() === "content" &&
        DomHelpers.isTypeof(slot, "div") === false
      ) {
        throw new Error('Slot `<slot="div">` must be a DIV element.');
      }

      this.querySelector(
        `slot[name="${slot.getAttribute("slot")}"]`
      )!.replaceWith(slot);

      if (this.querySelector('span[slot="trigger"]')!.id) {
        this.querySelector('button.cc-modal__trigger')!.id = this.querySelector('span[slot="trigger"]')!.id;
        this.querySelector('span[slot="trigger"]')!.removeAttribute('id');
      }
    });
  }

  protected render() {
    this.clone();
  }

  private close() {
    this.querySelector('.cc-modal')?.classList.remove('show-content');
  }

  protected connectedCallback() {
    DomHelpers.loadComponent(this);
    this.trigger = this.querySelector('.cc-modal__trigger');
    this.content = this.querySelector('.cc-modal__trigger + *');
    this.querySelector('.cc-modal__close')!.addEventListener('click', this.close);
    this.trigger!.addEventListener('click', () => {
      this.querySelector('.cc-modal')?.classList.add('show-content');
    });

    // The modal can be closed via listening for events which may be ejected from child
    // components. The correct event name must be passed as a prop via `data-close-on`
    if (this.dataset.closeOn) {
      document.addEventListener(`${this.dataset.closeOn}`, () => {
        this.close();
      });
    }
  }

  private template = `
    <article class="cc-modal">
      <button class="cc-modal__trigger btn__rounded text-center"><slot name="trigger"></slot></button>
      <div class="cc-modal__background">
        <button class="cc-modal__close" aria-label="Close modal">Close</button>
        <slot name="content"></slot>
      </div>
    </article>
  `;
}
