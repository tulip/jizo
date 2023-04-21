import { DomHelpers } from "@utils";
import { AlertDismissed, AlertAction } from "./events";
import "@styles/components/modal/alert.scss";

export default class Alert extends HTMLElement {
  dismiss: HTMLButtonElement | null;
  action: HTMLButtonElement | null;

  constructor() {
    super();

    this.dismiss = this.querySelector('[slot="dismiss"]')?.cloneNode(
      true
    ) as HTMLButtonElement;
    if (this.dismiss && DomHelpers.isTypeof(this.dismiss, "button") === false) {
      throw new Error('Slot `<slot="dismiss">` must be a BUTTON element.');
    }
    if (this.querySelector('[slot="dismiss"]')) {
      this.querySelector('[slot="dismiss"]')?.remove();
    }

    this.action = this.querySelector('[slot="action"]')?.cloneNode(
      true
    ) as HTMLButtonElement;
    if (this.action && DomHelpers.isTypeof(this.action, "button") === false) {
      throw new Error('Slot `<slot="action">` must be a BUTTON element.');
    }
    if (this.querySelector('[slot="action"]')) {
      this.querySelector('[slot="action"]')?.remove();
    }

    // bindings
    this.close = this.close.bind(this);
  }

  private clone() {
    const slots = this.querySelectorAll("[slot]");
    this.innerHTML = this.template;
    slots.forEach((slot: Element) => {
      this.querySelector(
        `slot[name="${slot.getAttribute("slot")}"]`
      )!.replaceWith(slot);
    });

    if (this.dismiss) {
      this.querySelector(".btn__dismiss")!.replaceWith(this.dismiss);
    }

    if (this.action) {
      this.querySelector("form")!.appendChild(this.action);
    }
  }

  private close() {
    this.querySelector(".cc-alert")?.removeAttribute("open");
    this.remove();
  }

  protected connectedCallback() {
    this.clone();

    this.querySelector("form")?.addEventListener("submit", this.close);

    if (this.action) {
      if (this.action.dataset.action) {
        AlertAction.detail.action = this.action.dataset.action;
      }
      this.action.addEventListener("click", () => {
        document.dispatchEvent(AlertAction);
      });
    }

    if (this.dismiss) {
      if (this.dismiss.dataset.action) {
        AlertDismissed.detail.action = this.dismiss.dataset.action;
      }
      this.dismiss.addEventListener("click", () => {
        document.dispatchEvent(AlertDismissed);
      });
    }

    DomHelpers.loadComponent(this);
  }

  private template = `
    <dialog class="cc-alert" open>
      <div class="cc-alert__background">
        <article class="cc-alert__content">
          <div><slot name="content"></slot></div>
          <form method="dialog">
            <button class="btn__rounded btn__dismiss" type="submit">Dismiss</button>
          </form>
        </article>
      </div>
    </dialog>
  `;
}
