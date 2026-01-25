import { type Component, For, Show } from "solid-js";
import type { TimelineItemWithPosition } from "../utils";

type TimelineBarProps = {
  item: TimelineItemWithPosition;
  onHover?: (item: TimelineItemWithPosition | null) => void;
};

export const TimelineBar: Component<TimelineBarProps> = (props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
    });
  };

  const formatDateRange = () => {
    const start = formatDate(props.item.startDate);
    if (props.item.endDate) {
      return `${start} - ${formatDate(props.item.endDate)}`;
    }
    return `${start} - Présent`;
  };

  return (
    <div
      class="absolute group"
      style={{
        left: `${props.item.left}%`,
        width: `${props.item.width}%`,
        top: `${props.item.level * 60}px`,
      }}
      onmouseenter={() => props.onHover?.(props.item)}
      onmouseleave={() => props.onHover?.(null)}
    >
      {/* Barre principale */}
      <div class="h-10 bg-primary rounded-md shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center px-3 border-2 border-primary-focus">
        <div class="flex-1 min-w-0">
          <div class="text-xs font-bold text-primary-content truncate leading-tight">
            {props.item.title}
          </div>
          <div class="text-xs text-primary-content/80 truncate leading-tight">
            {props.item.entity}
          </div>
        </div>
      </div>

      {/* Tooltip au hover */}
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-64">
        <div class="bg-base-200 text-base-content p-3 rounded-lg shadow-xl border border-base-300">
          <div class="font-mono text-xs italic text-base-content/70 mb-1">
            {formatDateRange()}
          </div>
          <h3 class="font-bold text-sm mb-1">{props.item.title}</h3>
          <div class="text-sm text-primary mb-1">{props.item.entity}</div>
          <div class="text-xs text-base-content/70 mb-2">
            {props.item.location}
          </div>
          <p class="text-xs text-base-content/90 mb-2">
            {props.item.description}
          </p>
          <Show
            when={props.item.technologies && props.item.technologies.length > 0}
          >
            <div class="flex flex-wrap gap-1">
              <For each={props.item.technologies}>
                {(tech) => (
                  <span class="badge badge-primary badge-sm">{tech}</span>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};
