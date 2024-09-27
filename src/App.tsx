import "@/services/dates/config";
import { ConfigProvider, theme as antdTheme } from "antd";
import "antd/dist/reset.css";
import frFR from "antd/locale/fr_FR";
import { memo } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "./components";
import { Routes } from "./routes";
import { theme } from "./styles";
import "./styles/antd.less";
import "./styles/global.less";

const themeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: theme,
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
