import { DomHelpers } from "@utils";
import RouterHistory from "./RouterHistory";

export default class StaticRouter extends HTMLElement {
  public id: string = crypto.randomUUID();
  public href: string;
  public state: string;
  public history: RouterHistory;
  private observer: MutationObserver | null;

  constructor(href: string = "#", state: string = "loading") {
    super();

    this.href = this.dataset.href ? this.dataset.href : href;
    this.state = this.dataset.state ? this.dataset.state : state;
    this.history = new RouterHistory(this);
    this.observer = null;

    globalThis.StaticRouter = this;
  }

  private async getPage(href: string) {
    const res = await fetch(href);

    if (res && res.ok) {
      return res;
    } else {
      return new Error();
    }
  }

  private clone() {
    this.innerHTML = this.template;
    this.state = "loading";

    if (this.href !== "#") {
      this.renderPage();
    }
  }

  private async renderPage() {
    const page: Response | Error = await this.getPage(
      `${this.href}/index.html`
    );
    const panel = this.querySelector(`#static-router-${this.id}`);

    if (page instanceof Response) {
      const contents = await page.text();
      const parser = new DOMParser();
      const markup = parser.parseFromString(contents, "text/html");
      panel!.innerHTML = markup.firstElementChild!.outerHTML;

      if (markup.body.querySelector("script")) {
        this.injectBodyScripts(Array.from(markup.querySelectorAll("script")));
      }

      await globalThis.Listeners.loadListeners();
      await globalThis.Registry.loadModules().then((registry: Array<CustomElementConstructor>) => {
        globalThis.Registry.registry = registry;
        globalThis.Registry.initRegistry();
      });
    }

    this.state = "idle";
  }

  private injectBodyScripts(scripts: Array<HTMLScriptElement>) {
    scripts.forEach((script, index) => {
      if (!document.body.querySelector(`script#injected-script_${index}`)) {
        setTimeout(() => {
          const injectedScript = document.createElement("script");
          injectedScript.setAttribute("id", `injected-script_${index}`);
          injectedScript.innerHTML = script.innerHTML;
          document.body.appendChild(injectedScript);
        }, 50);
      }
    });
  }

  private initListeners() {
    this.observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName) {
          if (mutation.attributeName === "data-href") {
            this.href = this.getAttribute(mutation.attributeName)!;
            this.clone();
          }
        }
      });
    });

    this.observer.observe(this, {
      childList: true,
      attributes: true,
    });
  }

  // @ts-ignore
  private connectedCallback() {
    this.clone();
    this.initListeners();
    DomHelpers.loadComponent(this);
  }

  private template = `
    <section id="static-router-${this.id}" aria-label="You are now viewing the following page: {{ GET PAGE TITLE }}" class="cc-static-router">
    </section>
  `;
}
