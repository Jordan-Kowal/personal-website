import { IconButton } from "@/components/ui";
import { memo } from "react";
import { Link } from "react-router-dom";

type LinkCardActionProps = {
  icon: React.ReactNode;
  tooltip: string;
  url?: string;
};

export const LinkCardAction: React.FC<LinkCardActionProps> = memo(
  ({ icon, tooltip, url }) => {
    if (!url) {
      return (
        <IconButton
          size="large"
          type="text"
          icon={icon}
          disabled
          tooltip={tooltip}
        />
      );
    }

    return (
      <Link to={url} target="_blank">
        <IconButton size="large" type="text" icon={icon} tooltip={tooltip} />
      </Link>
    );
  },
);
