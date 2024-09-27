import {
  type RenderHookResult,
  render,
  renderHook,
} from "@testing-library/react";
import { ConfigProvider } from "antd";
import frFR from "antd/locale/fr_FR";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

const wrapComponent = (children: ReactNode) => (
  // @ts-ignore
  <BrowserRouter basename={import.meta.env.BASE_URL || ""}>
    <ConfigProvider locale={frFR}>{children}</ConfigProvider>
  </BrowserRouter>
);

type ImprovedRender = (
  node: Parameters<typeof render>[0],
) => ReturnType<typeof render>;

const improvedRender: ImprovedRender = (node) =>
  render(node, { wrapper: ({ children }) => wrapComponent(children) });

type ImprovedRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
) => RenderHookResult<TResult, TProps>;

const improvedRenderHook: ImprovedRenderHook = (hook) =>
  renderHook(hook, {
    wrapper: ({ children }) => wrapComponent(children),
  });

export { improvedRender as render, improvedRenderHook as renderHook };
