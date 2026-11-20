import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { isHiddenPath } from 'src/config-global';
import { MobileLayout } from 'src/layouts/mobile-layout';

import { CheckAuth } from './components/check-auth';
import { renderFallback } from './components/fallback';
// ----------------------------------------------------------------------

const routesSection: RouteObject[] = [
  {
    element: (
      <CheckAuth fallback={renderFallback()}>
        <MobileLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </MobileLayout>
      </CheckAuth>
    ),
    children: [
      {
        index: true,
        Component: lazy(() => import('src/pages/home/page')),
      },
      {
        path: 'user-management',
        Component: lazy(() => import('src/pages/user-mgt')),
      },
      {
        path: 'user-management/my-profile',
        Component: lazy(() => import('src/pages/user-mgt/profile')),
      },
      {
        path: 'file-management',
        Component: lazy(() => import('src/pages/file-mgt')),
      },
      {
        path: 'book-management',
        Component: lazy(() => import('src/pages/book-mgt')),
      },
      {
        path: 'book-management/handle',
        Component: lazy(() => import('src/pages/book-mgt/add-page')),
      },
      {
        path: 'book-management/detail/:slug',
        Component: lazy(() => import('src/pages/book-mgt/detail')),
      },
      {
        path: 'category-management',
        Component: lazy(() => import('src/pages/category-mgt/page')),
      },
      {
        path: 'promotion-book-management',
        Component: lazy(() => import('src/pages/promotions-mgt/page')),
      },
      {
        path: 'promotion-book-management/handle',
        Component: lazy(() => import('src/pages/promotions-mgt/handle')),
      },
      {
        path: 'user-management/setting-account',
        Component: lazy(() => import('src/pages/user-mgt/setting')),
      },
      {
        path: 'cart',
        Component: lazy(() => import('src/pages/shop/cart-page')),
      },
      {
        path: 'checkout',
        Component: lazy(() => import('src/pages/shop/checkout-page')),
      },
      {
        path: 'orders',
        Component: lazy(() => import('src/pages/shop/orders-page')),
      },
      {
        path: 'orders/:code',
        Component: lazy(() => import('src/pages/shop/order-detail-page')),
      },
      {
        path: 'contact',
        Component: lazy(() => import('src/pages/contact/page')),
      },
    ].filter((route) => !isHiddenPath(route.path)), // màn đang ẩn (CONFIG.hiddenPaths) → mở URL ra 404
  },
  {
    path: 'sign-up',
    Component: lazy(() => import('src/pages/user-mgt/sign-up')),
  },
  {
    path: 'sign-in',
    Component: lazy(() => import('src/pages/sign-in')),
  },
  { path: '*', Component: lazy(() => import('src/pages/not-found-view/index')) },
];

export default routesSection;
