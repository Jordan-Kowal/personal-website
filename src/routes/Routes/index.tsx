import { Spin } from "@/components/ui";
import { Suspense, memo } from "react";
import { Navigate, Route, Routes as RouterRoutes } from "react-router-dom";
import { type RouteConfigProps, routeConfig } from "../routeConfig";
import styles from "./Routes.module.less";

export const Routes: React.FC = memo(() => (
  <RouterRoutes>
    {Object.entries(routeConfig).map(([key, { path }]) => {
      // @ts-ignore
      const data = routeConfig[key] as RouteConfigProps;
      const Component = data.component;
      return (
        <Route
          key={key}
          path={path}
          element={
            <Suspense
              fallback={<Spin tip="Loading..." className={styles.suspense} />}
            >
              <Component />
            </Suspense>
          }
        />
      );
    })}
    <Route path="*" element={<Navigate to={routeConfig.home.path} replace />} />
  </RouterRoutes>
));
