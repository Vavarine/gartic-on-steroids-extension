const callbacks = new Map<string, (elementList: HTMLElement[]) => void>();

let timeout: NodeJS.Timeout;

const observer = new MutationObserver(() => {
  const run = () => {
    Array.from(callbacks.entries()).forEach(([selector, callback]) => {
      const $elementList = document.querySelectorAll<HTMLElement>(
        `${selector}:not([data-sentinel="true"])`,
      );

      $elementList.forEach(($el) => {
        $el.setAttribute("data-sentinel", "true");
      });

      $elementList.length && callback(Array.from($elementList));
    });
  };

  run();
  clearTimeout(timeout);
  timeout = setTimeout(run, 100);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

export function sentinel(
  selector: string,
  callback: (elementList: HTMLElement[]) => void | Promise<void>,
) {
  callbacks.set(selector, callback);
}

export function isSentinel(element: HTMLElement) {
  return element.getAttribute("data-sentinel") === "true";
}