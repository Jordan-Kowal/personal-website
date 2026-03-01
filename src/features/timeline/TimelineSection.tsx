import { Clock } from "lucide-solid";
import { createMemo, createSignal, For, Show } from "solid-js";
import { Section } from "@/components/layout";
import { TimelineEvent } from "./components/TimelineEvent";
import { TimelineLine } from "./components/TimelineLine";
import { TimelinePopover } from "./components/TimelinePopover";
import { educationData, experienceData } from "./data";
import type { TimelineItem } from "./types";
import { dateToPosition, getTimelineBounds } from "./utils";

export const TimelineSection = () => {
  const [hoveredItem, setHoveredItem] = createSignal<TimelineItem | null>(null);
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;

  const showItem = (item: TimelineItem) => {
    clearTimeout(leaveTimer);
    setHoveredItem(item);
  };

  const hideItem = () => {
    leaveTimer = setTimeout(() => setHoveredItem(null), 200);
  };

  const toggleItem = (item: TimelineItem) => {
    clearTimeout(leaveTimer);
    setHoveredItem((prev) => (prev?.id === item.id ? null : item));
  };

  const allItems = createMemo(() =>
    [...experienceData, ...educationData].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    ),
  );

  const bounds = createMemo(() => getTimelineBounds(allItems()));

  const positionedItems = createMemo(() =>
    allItems().map((item, index) => ({
      item,
      position: dateToPosition(
        item.startDate,
        bounds().startYear,
        bounds().endYear,
      ),
      side: (index % 2 === 0 ? "above" : "below") as "above" | "below",
    })),
  );

  return (
    <Section id="timeline" title="Timeline" icon={Clock} overflowVisible>
      {/* Timeline container */}
      <div class="relative w-full py-30">
        {/* Main line */}
        <div class="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2">
          <TimelineLine
            startYear={bounds().startYear}
            endYear={bounds().endYear}
            hoveredItem={hoveredItem()}
          />
        </div>

        {/* Events */}
        <For each={positionedItems()}>
          {(positioned) => {
            const isOpen = createMemo(
              () => hoveredItem()?.id === positioned.item.id,
            );

            return (
              <div
                class="absolute z-10 -translate-x-1/2"
                classList={{
                  "bottom-1/2": positioned.side === "above",
                  "top-1/2": positioned.side === "below",
                }}
                style={{ left: `${positioned.position}%` }}
                data-timeline-event
                onmouseenter={() => showItem(positioned.item)}
                onmouseleave={hideItem}
              >
                {/* Popover above */}
                <Show when={isOpen() && positioned.side === "above"}>
                  <div class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2">
                    <TimelinePopover item={positioned.item} side="above" />
                  </div>
                </Show>

                {/* Event circle + connector */}
                <TimelineEvent
                  item={positioned.item}
                  side={positioned.side}
                  isOpen={isOpen()}
                  onClick={() => toggleItem(positioned.item)}
                />

                {/* Popover below */}
                <Show when={isOpen() && positioned.side === "below"}>
                  <div class="absolute top-full left-1/2 mt-2 -translate-x-1/2">
                    <TimelinePopover item={positioned.item} side="below" />
                  </div>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    </Section>
  );
};
