import { AppLayout } from "@/components/layout";
import { Routes } from "@/routes";
import { antdTheme } from "@/styles";
import "@/styles/antd.less";
import "@/styles/global.less";
import "@/utils/dates/config";
import { ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";
import frFR from "antd/locale/fr_FR";
import { memo } from "react";
import { BrowserRouter } from "react-router-dom";

const themeConfig = {
  algorithm: theme.darkAlgorithm,
  token: antdTheme,
};

export const App = memo(() => (
  // @ts-ignore
  <BrowserRouter basename={import.meta.env.BASE_URL || ""}>
    <ConfigProvider locale={frFR} theme={themeConfig}>
      <AppLayout>
        <Routes />
      </AppLayout>
    </ConfigProvider>
  </BrowserRouter>
));
