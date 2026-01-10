import { Layout } from "antd";
import type React from "react";
import { memo } from "react";
import { Footer } from "../Footer";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<AppLayoutProps> = memo(({ children }) => (
  <Layout>
    <Layout.Content>{children}</Layout.Content>
    <Footer />
  </Layout>
));
