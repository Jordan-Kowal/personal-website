import { Socials } from "@/components/features/Socials";
import { Logo, Space } from "@/components/ui";
import { now } from "@/utils/dates";
import { Layout, Typography } from "antd";
import type React from "react";
import { memo } from "react";

const { Text } = Typography;

export const Footer: React.FC = memo(() => (
  <Layout.Footer className="flex h-footer items-center justify-center p-0 pt-2 text-center">
    <Space vertical block>
      <Socials />
      <Space block centered>
        <Logo height={20} />
        <Text type="secondary" italic className="text-xs">
          Copyright © 2022-{now().year()} JKDev. All Rights Reserved.
        </Text>
      </Space>
    </Space>
  </Layout.Footer>
));
