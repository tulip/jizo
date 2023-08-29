import { DomHelpers } from "@utils";
import "@styles/components/links/link-basic.scss";

export default class Link extends HTMLElement {
  id: string = crypto.randomUUID();
  href: string | null;

  constructor() {
    super();

    this.href = this.getAttribute('href');
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
      this.querySelector(":scope > a")!.appendChild(child);
    });
    DomHelpers.inheritParentSelectors(
      this,
      this.querySelector(":scope > a")!
    );
  }

  // @ts-ignore
  private connectedCallback() {

    this.clone();
    this.setAttribute('tabindex', '0');

    this.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      globalThis.StaticRouter.setAttribute('data-href', this.href);
    });

    DomHelpers.loadComponent(this);
  }

  private template = `
    <a id="${this.id}">
    </a>
  `;
}
