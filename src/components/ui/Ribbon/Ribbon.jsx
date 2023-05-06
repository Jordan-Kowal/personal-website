import React, { memo } from 'react';
import { Badge } from 'antd';
import PropTypes from 'prop-types';

export const Ribbon = ({ children, text }) => {
  if (!text) return children;
  return <Badge.Ribbon text={text}>{children}</Badge.Ribbon>;
};

Ribbon.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
};

export default memo(Ribbon);
