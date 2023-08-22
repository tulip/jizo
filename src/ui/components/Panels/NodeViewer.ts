import { DomHelpers } from "@utils";
import { default as AnsiUp } from 'ansi_up';

import "@styles/components/panels/node-viewer.scss";

// keyboard shortcuts to show / hide the panel
// need to be able to write to the panel
  // maybe be able to read from the panel at some point ???
// needs to have EASY communication to the backend

export default class NodeJsPanel extends HTMLElement {
  isOpen: boolean;
  contentBlock: HTMLElement | null;
  ansi: AnsiUp;

  constructor() {
    super();

    this.isOpen = this.dataset.open ? true : false;
    this.contentBlock = null;
    this.ansi = new AnsiUp();
    this.render();
  }

  protected render() {
    this.innerHTML = this.template;
  }

  private bindListeners() {
    this.querySelector('.btn__close')!.addEventListener('click', () => {
      this.isOpen && this.closePanel();
    });

    this.querySelector('.btn__show')!.addEventListener('click', () => {
      !this.isOpen && this.openPanel();
    });

    document.addEventListener('update-node-output', (event: any) => {
      this.updateContentBlock(event.detail);
    });
  };

  private closePanel() {
    this.isOpen = false;
    this.removeAttribute('data-open');
  };

  private openPanel() {
    this.isOpen = true;
    this.setAttribute('data-open', 'true');
  };

  private updateContentBlock(content: string) {
    const block = document.createElement('p');
    const ansi = this.ansi.ansi_to_html(content);
    block.innerHTML = ansi;
    this.contentBlock?.appendChild(block);
    this.contentBlock!.scrollTop = this.contentBlock!.scrollHeight;
  }

  protected connectedCallback() {
    const block = document.createElement('p');
    block.textContent = 'Welcome!';
    this.contentBlock = this.querySelector('.cc-node-js-panel__content')!;
    this.contentBlock.appendChild(block);
    this.bindListeners();

    DomHelpers.loadComponent(this);
  }

  private template = `
    <div class="cc-node-js-panel">
      <div class="cc-node-js-panel__controls">
        <button class="btn__rounded btn__show">
          Show Node Output
        </button>
        <button class="btn__rounded btn__close">
          Close
        </button>
      </div>
      <div class="cc-node-js-panel__console">
        <div class="cc-node-js-panel__content">
        </div>
      </div>
    </div>
  `;
};
