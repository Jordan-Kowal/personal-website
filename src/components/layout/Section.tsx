import type { Component, ParentComponent } from "solid-js";
import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ContentContainer } from "./ContentContainer";

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  alternate?: boolean;
  icon?: Component<{ size: number }>;
  overflowVisible?: boolean;
};

export const Section: ParentComponent<SectionProps> = (props) => {
  return (
    <section
      id={props.id}
      class={`pt-4 pb-8 ${props.overflowVisible ? "" : "overflow-x-hidden"} ${props.alternate ? "bg-base-200" : ""}`}
    >
      <ContentContainer>
        <div class="text-center my-8!">
          <h2 class="text-2xl sm:text-4xl font-bold mt-0! mb-0! flex items-center justify-center gap-3">
            <Show when={props.icon}>
              {(icon) => <Dynamic component={icon()} size={28} />}
            </Show>
            {props.title}
          </h2>
          {props.description && (
            <p class="text-base-content/70">{props.description}</p>
          )}
        </div>
        {props.children}
      </ContentContainer>
    </section>
  );
};
