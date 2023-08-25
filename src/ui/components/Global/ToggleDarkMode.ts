type Theme = {
  status?: string | undefined;
  themes?: Array<string>;
};

type ValueOf<T> = T[keyof T];

const STATE: Theme = {
  status: undefined,
  themes: ['dark', 'light'],
};

const ToggleDarkMode = (element: HTMLElement) => {
  const self = element;

  const setState = (entry: Theme) => {
    try {
      Object.keys(entry).forEach((key) => {
        (STATE[key as keyof typeof STATE] as ValueOf<typeof STATE>) =
          entry.status;
      });
    } catch (e) {
      console.error(e);
      throw new Error();
    }
  };

  const toggleTheme = () => {
    const { status, themes } = STATE;
    const newStatus =
      STATE.themes!.indexOf(status as string) === 0 ? themes![1] : themes![0];
    setState({
      status: newStatus,
    });
    window.document.body.dataset.theme = newStatus;
  };

  const bindListeners = () => {
    self
      .querySelector(':scope > input')!
      .addEventListener('click', toggleTheme);

    self
      .querySelector(':scope > label')!
      .addEventListener('keydown', (e: Event) => {
        if ((e as KeyboardEvent).key === 'Enter') {
          (self.querySelector(':scope > input')! as HTMLElement).click();
        }
      });
  };

  const init = () => {
    setState({
      status: window.document.body.dataset.theme?.toLowerCase(),
    });
    bindListeners();
  };

  init();
};

export default ToggleDarkMode;
