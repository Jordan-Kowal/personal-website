import type { Skill } from "@/data/skills";
import { Image, Tooltip } from "antd";
import classNames from "classnames";
import { memo } from "react";
import styles from "./SkillIcon.module.less";

type SkillIconProps = {
  className?: string;
  skill: Skill;
  size?: number;
};

export const SkillIcon: React.FC<SkillIconProps> = memo(
  ({ skill, className, size = 20 }) => (
    <Tooltip title={skill.name}>
      <Image
        className={classNames(styles.icon, className)}
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
