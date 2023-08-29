import { RouterHistoryItem } from "./types";

export class RouterHistory {
  private routerInstance: typeof StaticRouter;

  constructor(routerInstance: typeof StaticRouter) {
    this.routerInstance = routerInstance;
    this.handleNavigate = this.handleNavigate.bind(this);

    if (this.routerInstance.getAttribute("data-href")) {
      window.history.replaceState(this.makeRouterHistoryItem(this.routerInstance.getAttribute("data-href"), null), "", "");
    } else {
      window.history.replaceState(this.makeRouterHistoryItem("/", null), "", "");
    }

    window.addEventListener('popstate', this.handleNavigate);
  }

  private handleNavigate(event: PopStateEvent) {
    event.preventDefault();
    const { state } = event;

    if (!state) {
      return;
    }

    this.navigate(state.href, state);
  }

  private makeRouterHistoryItem(href: string, ref: string | null): RouterHistoryItem {
    return {
      href,
      ref
    };
  }

  private addItem(href: string, ref: string | null) {
    window.history.pushState(this.makeRouterHistoryItem(href, ref), "", "");
  }

  public navigate(href: string, state?: any) {
    if (!state) {
      this.addItem(href, this.routerInstance.getAttribute('data-href'));
    }
    this.routerInstance.setAttribute('data-href', href);
  }
}
