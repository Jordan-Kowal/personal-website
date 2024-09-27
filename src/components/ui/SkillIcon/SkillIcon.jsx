import { SkillPropType } from "@/core/proptypes";
import { Image, Tooltip } from "antd";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styles from "./SkillIcon.module.less";

const SkillIcon = ({ skill, className, size = 20 }) => (
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
);

SkillIcon.propTypes = {
  className: PropTypes.string,
  skill: SkillPropType.isRequired,
  size: PropTypes.number,
};

export default memo(SkillIcon);
