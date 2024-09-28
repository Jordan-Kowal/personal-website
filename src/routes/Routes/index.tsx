import { Spin } from "@/components/ui";
import { theme } from "@/styles";
import { Suspense, memo } from "react";
import { Navigate, Route, Routes as RouterRoutes } from "react-router-dom";
import { type RouteConfigProps, routeConfig } from "../routeConfig";

const routeStyle = {
  minHeight: `calc(100vh - ${theme.layout.footerHeight})`,
  paddingTop: "45vh",
};

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
            <Suspense fallback={<Spin tip="Loading..." style={routeStyle} />}>
              <Component />
            </Suspense>
          }
        />
      );
    })}
    <Route path="*" element={<Navigate to={routeConfig.home.path} replace />} />
  </RouterRoutes>
));
