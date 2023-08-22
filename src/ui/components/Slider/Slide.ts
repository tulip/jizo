import { DomHelpers } from "@utils";

export default class Slide extends HTMLElement {
  constructor() {
    super();
  }

  private clone() {
    this.innerHTML = this.template;
  }

  protected connectedCallback() {
    const children = Array.from(this.children).filter(
      (child) => !child.getAttribute("slot")
    );

    this.clone();

    children.length &&
      children.forEach((child) =>
        this.querySelector(":scope > .cc-slide")?.appendChild(child)
      );

    DomHelpers.loadComponent(this);
  }

  private template = `
    <div class="cc-slide">
    </div>
  `;
}
