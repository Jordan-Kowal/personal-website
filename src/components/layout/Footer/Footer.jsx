import React, { memo } from 'react';
import { Col, Layout, Row, Typography } from 'antd';
import Socials from '@/components/features/Socials';
import { Logo, Space } from '@/components/ui';
import { now } from '@/services/dates';
import styles from './Footer.module.less';

const { Text } = Typography;

const Footer = () => (
  <Layout.Footer className={styles.footer}>
    <Space vertical block>
      <Socials />
      <Row>
        <Col flex="30px">
          <Logo height={20} />
        </Col>
        <Col flex="1 1 0">
          <Text type="secondary" italic className={styles.footerText}>
            Copyright © 2022-{now().year()} JKDev. All Rights Reserved.
          </Text>
        </Col>
      </Row>
    </Space>
  </Layout.Footer>
);

Footer.propTypes = {};

export default memo(Footer);
