import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { IconButton } from '@/components';

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
