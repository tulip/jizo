export const isDivElement = function (element: Element) {
  return element.tagName.toLowerCase() === "div";
};

export const isTypeof = function (element: Element, nodetype: string) {
  return element.tagName.toLowerCase() === nodetype;
};

export const isOnScreen = function (element: Element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const checkRendered = function (element: Element) {
  return element.hasAttribute("data-rendered");
};

export const checkVisible = function (element: Element) {
  return element.hasAttribute("data-visible");
};

export const loadComponent = function (element: Element) {
  const host = element.classList.contains("cc-load")
    ? element
    : element.closest(".cc-load");

  if (host) {
    try {
      !host!.getAttribute("data-rendered") &&
        host!.setAttribute("data-rendered", "true");
      isOnScreen(element) &&
        !host!.getAttribute("data-opaque") &&
        host!.setAttribute("data-opaque", "true");
    } catch (e) {
      console.error(e);
      throw new Error();
    }
  }
};
