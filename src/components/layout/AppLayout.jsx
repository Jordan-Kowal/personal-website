import React, { memo } from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import styles from './AppLayout.module.less';
import Footer from './Footer';
import Header from './Header';

const AppLayout = ({ children }) => (
  <Layout className={styles.appLayout}>
    <Header />
    <Layout.Content className={styles.content}>{children}</Layout.Content>
    <Footer />
  </Layout>
);

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(AppLayout);
