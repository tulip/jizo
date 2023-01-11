export const WindowWatcher = (
  WatcherOpts: IntersectionObserverInit,
  elementSelector: string
) => {
  globalThis.Watcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.isIntersecting &&
        entry.target.getAttribute('data-rendered') &&
        entry.target.setAttribute('data-opaque', 'true');
    });
  }, WatcherOpts);

  Array.from(document.querySelectorAll(elementSelector)).forEach((component) =>
    globalThis.Watcher.observe(component)
  );
};
