import { IconButton } from "@/components";
import PropTypes from "prop-types";
import React, { memo } from "react";
import { Link } from "react-router-dom";

const LinkCardAction = ({ icon, tooltip, url }) => {
  if (!url) {
    return (
      <IconButton size="large" isText icon={icon} disabled tooltip={tooltip} />
    );
  }

  return (
    <Link to={url} target="_blank">
      <IconButton size="large" isText icon={icon} tooltip={tooltip} />
    </Link>
  );
};

LinkCardAction.propTypes = {
  icon: PropTypes.node,
  tooltip: PropTypes.string,
  url: PropTypes.string,
};

export default memo(LinkCardAction);
