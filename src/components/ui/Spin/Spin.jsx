import React, { memo } from 'react';
import { Spin as AntdSpin } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './Spin.module.less';

const Spin = ({
  text = 'Loading...',
  className,
  children,
  spinning = true,
}) => (
  <div className={styles.spinContainer}>
    <AntdSpin
      className={classNames(styles.antdSpin, className)}
      tip={text}
      spinning={spinning}
    >
      {children}
    </AntdSpin>
  </div>
);

Spin.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  spinning: PropTypes.bool,
  className: PropTypes.string,
};

export default memo(Spin);
