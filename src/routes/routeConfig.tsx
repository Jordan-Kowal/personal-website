import { lazy } from "react";

export type RouteConfigKey = "home";

export type RouteConfigProps = {
  key: RouteConfigKey;
  name: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  path: string;
  exact?: boolean;
};

export type RouteConfig = Record<RouteConfigKey, RouteConfigProps>;

export const routeConfig: RouteConfig = {
  home: {
    key: "home",
    name: "Home",
    component: lazy(() => import("../pages/Homepage")),
    path: "/",
  },
};
