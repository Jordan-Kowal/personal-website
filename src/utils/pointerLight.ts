import type { Attachment } from "svelte/attachments";

/**
 * One listener on the container lights every `[data-glow]` child: the pointer position is written
 * as --gx/--gy on the hovered child, which the global `[data-glow]::before` layer reads.
 */
export const pointerLight: Attachment<HTMLElement> = (container) => {
  const handleMove = (event: PointerEvent) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest<HTMLElement>("[data-glow]");
    if (!target || !container.contains(target)) return;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty("--gx", `${x.toFixed(1)}%`);
    target.style.setProperty("--gy", `${y.toFixed(1)}%`);
  };
  container.addEventListener("pointermove", handleMove, { passive: true });
  return () => container.removeEventListener("pointermove", handleMove);
};
