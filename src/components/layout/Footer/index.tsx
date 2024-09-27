import { Socials } from "@/components/features/Socials";
import { Logo, Space } from "@/components/ui";
import { now } from "@/utils/dates";
import { Layout, Typography } from "antd";
import type React from "react";
import { memo } from "react";
import styles from "./Footer.module.less";

const { Text } = Typography;

export const Footer: React.FC = memo(() => (
  <Layout.Footer className={styles.footer}>
    <Space vertical block>
      <Socials />
      <Space block centered>
        <Logo height={20} />
        <Text type="secondary" italic className={styles.footerText}>
          Copyright © 2022-{now().year()} JKDev. All Rights Reserved.
        </Text>
      </Space>
    </Space>
  </Layout.Footer>
));
