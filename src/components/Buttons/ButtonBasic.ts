import { DomHelpers } from "@utils";

export default class ButtonBasic extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  private clone() {
    const children: Array<Node> = [];

    Array.from(this.childNodes).forEach((child: Node) => {
      if (child.nodeType === 1) {
        children.push(child);
      } else if (child.nodeType === 3) {
        const txtNode = document.createTextNode(child.textContent!);
        children.push(txtNode);
      }
    });

    this.innerHTML = this.template;

    children.forEach((child: Node) => {
      this.querySelector(":scope > button")!.appendChild(child);
    });
    DomHelpers.inheritParentSelectors(
      this,
      this.querySelector(":scope > button")!
    );
  }

  render() {
    this.clone();
  }

  connectedCallback() {
    DomHelpers.loadComponent(this);
  }

  private template = `
    <button class="cc-basic-card" role="button">
    </button>
  `;
}
