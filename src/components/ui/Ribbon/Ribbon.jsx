import React, { memo } from 'react';
import { Badge } from 'antd';
import PropTypes from 'prop-types';

export const Ribbon = ({ children, text, color }) => {
  if (!text) return children;
  return (
    <Badge.Ribbon text={text} color={color}>
      {children}
    </Badge.Ribbon>
  );
};

Ribbon.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  text: PropTypes.string,
};

export default memo(Ribbon);
