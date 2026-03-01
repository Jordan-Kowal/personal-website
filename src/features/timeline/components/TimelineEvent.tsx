import { Briefcase, GraduationCap } from "lucide-solid";
import type { Component } from "solid-js";
import { Match, Show, Switch } from "solid-js";
import type { TimelineItem } from "../types";

type TimelineEventProps = {
  item: TimelineItem;
  side: "above" | "below";
  isOpen: boolean;
  onClick: () => void;
};

export const TimelineEvent: Component<TimelineEventProps> = (props) => {
  const isExperience = () => props.item.category === "experience";
  const logoIsString = () => typeof props.item.logo === "string";
  const logoIsIcon = () => typeof props.item.logo === "function";

  return (
    <div
      class="flex items-center"
      classList={{
        "flex-col-reverse": props.side === "above",
        "flex-col": props.side === "below",
      }}
    >
      {/* Dashed connector */}
      <div class="h-10 w-[1px] border-l border-dashed border-base-content/20" />

      {/* Circle with logo + category badge */}
      <div class="relative">
        <button
          type="button"
          onClick={props.onClick}
          class="relative z-30 flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[3px] border-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
          classList={{
            "scale-110 shadow-lg ring-2 ring-offset-2": props.isOpen,
            "ring-primary": props.isOpen && isExperience(),
            "ring-teal-500": props.isOpen && !isExperience(),
          }}
        >
          <Switch
            fallback={
              <div
                class="flex h-full w-full items-center justify-center text-xs font-bold"
                classList={{
                  "bg-primary/20 text-primary": isExperience(),
                  "bg-teal-500/20 text-teal-600": !isExperience(),
                }}
              >
                {props.item.entity.slice(0, 2)}
              </div>
            }
          >
            <Match when={logoIsString()}>
              <img
                src={props.item.logo as string}
                alt={props.item.entity}
                class="h-full w-full object-cover object-center"
                draggable={false}
              />
            </Match>
            <Match when={logoIsIcon()}>
              <div
                class="flex h-full w-full items-center justify-center"
                classList={{
                  "bg-primary/10 text-primary": isExperience(),
                  "bg-teal-500/10 text-teal-600": !isExperience(),
                }}
              >
                {(() => {
                  const Icon = props.item.logo as Exclude<
                    typeof props.item.logo,
                    string | undefined
                  >;
                  return <Icon size={40} />;
                })()}
              </div>
            </Match>
          </Switch>
        </button>

        {/* Category badge */}
        <div
          class="absolute -top-2 -right-2 z-40 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white"
          classList={{
            "bg-primary": isExperience(),
            "bg-teal-500": !isExperience(),
          }}
        >
          <Show
            when={isExperience()}
            fallback={<GraduationCap size={16} class="text-white" />}
          >
            <Briefcase size={16} class="text-white" />
          </Show>
        </div>
      </div>
    </div>
  );
};
