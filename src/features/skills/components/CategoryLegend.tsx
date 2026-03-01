import type { Accessor, Component, JSX } from "solid-js";
import { createMemo, For } from "solid-js";
import { CATEGORY_COLORS, SkillCategory } from "../constants";

type CategoryLegendProps = {
  highlightedCategory: Accessor<SkillCategory | null>;
  onHover: (category: SkillCategory | null) => void;
};

const CATEGORIES = Object.values(SkillCategory).sort((a, b) =>
  a.localeCompare(b),
);

export const CategoryLegend: Component<CategoryLegendProps> = (props) => {
  return (
    <div class="flex flex-wrap justify-center gap-2">
      <For each={CATEGORIES}>
        {(category) => (
          <CategoryPill
            category={category}
            highlightedCategory={props.highlightedCategory}
            onHover={props.onHover}
          />
        )}
      </For>
    </div>
  );
};

type CategoryPillProps = {
  category: SkillCategory;
  highlightedCategory: Accessor<SkillCategory | null>;
  onHover: (category: SkillCategory | null) => void;
};

const CategoryPill: Component<CategoryPillProps> = (props) => {
  const isHighlighted = createMemo(
    () => props.highlightedCategory() === props.category,
  );

  const colors = createMemo(() => CATEGORY_COLORS[props.category]);

  const style = createMemo(
    (): JSX.CSSProperties => ({
      background: isHighlighted() ? colors().background : "transparent",
      color: isHighlighted() ? colors().text : "#6b7280",
      "border-color": isHighlighted() ? colors().border : "#d1d5db",
      transition: "background 0.3s, color 0.3s, border-color 0.3s",
    }),
  );

  return (
    <span
      class="cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-semibold"
      style={style()}
      onmouseenter={() => props.onHover(props.category)}
      onmouseleave={() => props.onHover(null)}
    >
      {props.category}
    </span>
  );
};
