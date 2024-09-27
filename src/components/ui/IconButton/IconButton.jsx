import { Button, Tooltip } from "antd";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styles from "./IconButton.module.less";

const IconButton = ({
  disabled,
  icon,
  isActive,
  isText,
  onClick,
  size = "middle",
  tooltip,
  ...props
}) => (
  <Tooltip title={tooltip}>
    <Button
      className={classNames(styles.iconButton, {
        [styles.isActiveIcon]: isActive,
      })}
      disabled={disabled}
      shape="circle"
      type={isText ? "text" : "default"}
      icon={icon}
      size={size}
      onClick={onClick}
      {...props}
    />
  </Tooltip>
);

IconButton.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  isText: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
};

export default memo(IconButton);
