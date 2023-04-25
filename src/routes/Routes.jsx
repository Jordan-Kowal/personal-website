import React, { Suspense, memo } from 'react';
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';
import { Spin } from '@/components';
import routeConfig from './routeConfig';

const Routes = () => (
  <RouterRoutes>
    {Object.entries(routeConfig).map(([id, { path, exact }]) => {
      const Component = routeConfig[id].component;
      return (
        <Route
          key={id}
          path={path}
          element={
            <Suspense fallback={<Spin text="Loading..." />}>
              <Component />
            </Suspense>
          }
          exact={exact}
        />
      );
    })}
    <Route path="*" element={<Navigate to={routeConfig.home.path} replace />} />
  </RouterRoutes>
);

export default memo(Routes);
