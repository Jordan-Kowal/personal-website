import type { Skill } from "@/data/skills";
import { Image, Tooltip } from "antd";
import classNames from "classnames";
import { memo } from "react";

type SkillIconProps = {
  className?: string;
  skill: Skill;
  size?: number;
};

export const SkillIcon: React.FC<SkillIconProps> = memo(
  ({ skill, className, size = 20 }) => (
    <Tooltip title={skill.name}>
      <Image
        className={classNames("transition ease-in-out duration-300", className)}
        src={skill.icon}
        alt={skill.name}
        preview={false}
        style={{
          maxWidth: `${size}px`,
          maxHeight: `${size}px`,
        }}
      />
    </Tooltip>
  ),
);
