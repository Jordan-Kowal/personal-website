import { Tooltip } from "antd";
import classNames from "classnames";
import { memo } from "react";
import styles from "./ItemDot.module.less";

type ItemDotProps = {
  onGoing: boolean;
};

export const ItemDot: React.FC<ItemDotProps> = memo(({ onGoing }) => {
  const text = onGoing ? "On-going" : "";

  return (
    <Tooltip title={text}>
      <div
        className={classNames(styles.itemDot, {
          [styles.active]: onGoing,
        })}
      />
    </Tooltip>
  );
});
