import { Tooltip } from "antd";
import classNames from "classnames";
import { memo } from "react";

type ItemDotProps = {
  onGoing: boolean;
};

export const ItemDot: React.FC<ItemDotProps> = memo(({ onGoing }) => {
  const text = onGoing ? "On-going" : "";

  return (
    <Tooltip title={text}>
      <div className="rounded-full w-3 h-3 relative">
        {onGoing && (
          <div className="animate-ping absolute w-3 h-3  bg-info rounded-full z-0" />
        )}
        <div
          className={classNames("rounded-full w-3 h-3 z-10", {
            "bg-info": onGoing,
            "bg-primary": !onGoing,
          })}
        />
      </div>
    </Tooltip>
  );
});
