import React, { memo } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './ItemDot.module.less';

const ItemDot = ({ onGoing }) => {
  const text = onGoing ? 'On-going' : '';

  return (
    <Tooltip title={text}>
      <div
        className={classNames(styles.itemDot, {
          [styles.active]: onGoing,
        })}
      />
    </Tooltip>
  );
};

ItemDot.propTypes = {
  onGoing: PropTypes.bool,
};

export default memo(ItemDot);
