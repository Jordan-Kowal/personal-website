import { lazy } from "react";

const routeConfig = {
  home: {
    key: "home",
    component: lazy(() => import("../pages/Homepage")),
    path: "/",
    exact: true,
  },
};

export default routeConfig;
