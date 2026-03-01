import { ChevronLeft, ChevronRight, X } from "lucide-solid";
import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";

type ScreenshotModalProps = {
  screenshots: string[];
  initialIndex: number;
  onClose: () => void;
};

export const ScreenshotModal: Component<ScreenshotModalProps> = (props) => {
  const [currentIndex, setCurrentIndex] = createSignal(props.initialIndex);

  const goToPrev = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + props.screenshots.length) % props.screenshots.length,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % props.screenshots.length);
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <div
      role="dialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        class="btn btn-circle btn-ghost btn-sm absolute top-4 right-4 text-white"
        onClick={props.onClose}
      >
        <X size={24} />
      </button>

      <Show when={props.screenshots.length > 1}>
        <button
          type="button"
          class="btn btn-circle btn-ghost absolute left-4 text-white"
          onClick={goToPrev}
        >
          <ChevronLeft size={32} />
        </button>
      </Show>

      <img
        src={props.screenshots[currentIndex()]}
        alt={`Screenshot ${currentIndex() + 1}`}
        class="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
      />

      <Show when={props.screenshots.length > 1}>
        <button
          type="button"
          class="btn btn-circle btn-ghost absolute right-4 text-white"
          onClick={goToNext}
        >
          <ChevronRight size={32} />
        </button>
      </Show>
    </div>
  );
};
