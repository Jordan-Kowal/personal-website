import { Briefcase, GraduationCap, MapPin } from "lucide-solid";
import type { Component } from "solid-js";
import { Match, Show, Switch } from "solid-js";
import type { TimelineItem } from "../types";

type TimelinePopoverProps = {
  item: TimelineItem;
  side: "above" | "below";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const formatDateRange = (startDate: string, endDate?: string): string => {
  return endDate
    ? `${formatDate(startDate)} — ${formatDate(endDate)}`
    : `${formatDate(startDate)} — Present`;
};

export const TimelinePopover: Component<TimelinePopoverProps> = (props) => {
  const isExperience = () => props.item.category === "experience";
  const logoIsString = () => typeof props.item.logo === "string";
  const logoIsIcon = () => typeof props.item.logo === "function";

  return (
    <div
      class="card z-40 w-64 border border-base-300 bg-base-100 shadow-xl"
      style={{ animation: "popover-appear 0.15s ease-out" }}
      data-timeline-popover
    >
      <div class="card-body gap-3 p-3">
        {/* Logo / icon */}
        <div class="mb-1.5 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-base-200">
          <Switch
            fallback={
              <Show
                when={isExperience()}
                fallback={<GraduationCap size={14} class="text-teal-600" />}
              >
                <Briefcase size={14} class="text-primary" />
              </Show>
            }
          >
            <Match when={logoIsString()}>
              <img
                src={props.item.logo as string}
                alt={props.item.entity}
                class="h-full w-full object-cover"
              />
            </Match>
            <Match when={logoIsIcon()}>
              {(() => {
                const Icon = props.item.logo as Exclude<
                  typeof props.item.logo,
                  string | undefined
                >;
                return <Icon size={20} />;
              })()}
            </Match>
          </Switch>
        </div>
        <div>
          <h4 class="card-title text-sm! m-0!">{props.item.title}</h4>

          <p
            class="text-sm font-semibold m-0!"
            classList={{
              "text-primary": isExperience(),
              "text-teal-600": !isExperience(),
            }}
          >
            {props.item.entity}
          </p>
        </div>
        <div>
          <p class="flex items-center gap-1 text-xs text-base-content/50 m-0!">
            <MapPin size={10} />
            {props.item.location}
          </p>
          <time class="font-mono text-[10px] text-base-content/40">
            {formatDateRange(props.item.startDate, props.item.endDate)}
          </time>
        </div>

        <p class="m-0! text-xs leading-relaxed text-base-content/70">
          {props.item.description}
        </p>
      </div>
    </div>
  );
};
