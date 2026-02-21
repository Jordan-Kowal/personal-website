import type { ParentComponent } from "solid-js";
import { ContentContainer } from "./ContentContainer";

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  alternate?: boolean;
};

export const Section: ParentComponent<SectionProps> = (props) => {
  return (
    <section
      id={props.id}
      class={`py-4 overflow-x-hidden ${props.alternate ? "bg-base-200" : ""}`}
    >
      <ContentContainer>
        <div class="text-center my-8!">
          <h2 class="text-4xl font-bold mt-0! mb-0!">{props.title}</h2>
          {props.description && (
            <p class="text-base-content/70">{props.description}</p>
          )}
        </div>
        {props.children}
      </ContentContainer>
    </section>
  );
};
