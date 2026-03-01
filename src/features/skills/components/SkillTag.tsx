import type { Accessor, Component, JSX } from "solid-js";
import { createMemo } from "solid-js";
import { CATEGORY_COLORS, type Skill, type SkillCategory } from "../constants";

type SkillTagProps = {
  skill: Skill;
  highlightedCategory?: Accessor<SkillCategory | null>;
  onHover?: (category: SkillCategory | null) => void;
};

const BORDER_WIDTH = 1;

export const SkillTag: Component<SkillTagProps> = (props) => {
  const isHighlighted = createMemo(
    () =>
      !props.highlightedCategory ||
      props.highlightedCategory() === props.skill.category,
  );

  const colors = createMemo(() => CATEGORY_COLORS[props.skill.category]);

  const gradientStyle = createMemo((): JSX.CSSProperties => {
    const c = colors();
    return {
      position: "absolute",
      inset: `-${BORDER_WIDTH * 4}px`,
      background: `conic-gradient(from 0deg, ${c.border} 0deg, ${c.text} 60deg, transparent 120deg)`,
      animation: "spin-border 2s linear infinite",
      opacity: isHighlighted() ? "1" : "0",
      transition: "opacity 0.3s",
    };
  });

  const innerStyle = createMemo(
    (): JSX.CSSProperties => ({
      background: isHighlighted() ? colors().background : "#e5e7eb",
      color: isHighlighted() ? colors().text : "#6b7280",
      transition: "background 0.3s, color 0.3s",
    }),
  );

  return (
    <div
      onmouseenter={() => props.onHover?.(props.skill.category)}
      onmouseleave={() => props.onHover?.(null)}
    >
      <div
        class="relative overflow-hidden rounded-full"
        style={{
          padding: `${BORDER_WIDTH}px`,
          background: isHighlighted() ? undefined : "#d1d5db",
        }}
      >
        <div style={gradientStyle()} />
        <span
          class="relative z-10 inline-block cursor-default rounded-full px-3 py-1 text-sm font-medium"
          style={innerStyle()}
        >
          {props.skill.label}
        </span>
      </div>
    </div>
  );
};
