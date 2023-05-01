import React, { memo } from 'react';
import { Image } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { jkdevLogoUrl } from '@/assets';
import styles from './Logo.module.less';

const Logo = ({ height }) => (
  <Link to="/">
    <Image
      className={styles.logo}
      preview={false}
      src={jkdevLogoUrl}
      alt="Logo"
      height={height}
    />
  </Link>
);

Logo.propTypes = {
  height: PropTypes.number,
};

export default memo(Logo);
