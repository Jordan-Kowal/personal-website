import type { Attachment } from "svelte/attachments";

const DEFAULT_ROOT_MARGIN = "0px 0px -15% 0px";

/** Calls `onVisible` the first time the element enters the viewport, then stops observing. */
export const onceVisible =
  (
    onVisible: () => void,
    rootMargin = DEFAULT_ROOT_MARGIN,
  ): Attachment<HTMLElement> =>
  (element) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        onVisible();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  };
