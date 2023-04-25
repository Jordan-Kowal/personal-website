import React, { memo } from 'react';
import { Layout } from 'antd';
import styles from './Header.module.less';

const Header = () => (
  <Layout.Header className={styles.header}>Header</Layout.Header>
);

Header.propTypes = {};

export default memo(Header);
