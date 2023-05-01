import React, { memo } from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import Footer from './Footer';

const AppLayout = ({ children }) => (
  <Layout>
    <Layout.Content>{children}</Layout.Content>
    <Footer />
  </Layout>
);

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(AppLayout);
