import { Routes } from '@angular/router';
import { AppRoutes, MainLayout } from './core';
import { authGuard } from './core/guard/auth-guard';
import { loginGuard } from './core/guard/login-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: AppRoutes.LOGIN,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.LOGIN,
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [loginGuard]
  
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: AppRoutes.DASHBOARD,
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.EMPLOYEE,
        loadComponent: () => import('./pages/employee/employee-list/employee-list').then((m) => m.EmployeeList),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.CUSTOMER,
        loadComponent: () => import('./pages/customer/customer-list/customer-list').then((m) => m.CustomerList),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.COLLECTION,
        loadComponent: () =>
        import('./pages/collection/collection-list/collection-list').then((m) => m.CollectionList),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.CATEGORY,
        loadComponent: () => import('./pages/category/category-list/category-list').then((m) => m.CategoryList),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.BANNER,
        loadComponent: () => import('./pages/banner/banner-list/banner-list').then((m) => m.BannerList),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.PRODUCT,
        loadComponent: () => import('./pages/product/product-list/product-list').then((m) => m.ProductList),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.PRODUCT_UPSERT,
        loadComponent: () =>
        import('./pages/product/product-upsert/product-upsert').then((m) => m.ProductUpsert),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.ORDERS,
        loadComponent: () =>
        import('./pages/orders/order-list/order-list').then((m) => m.OrderList),
        canActivate: [authGuard],
      },
      {
        path: AppRoutes.ORDERS_UPSERT,
        loadComponent: () =>
        import('./pages/orders/order-details/order-details').then((m) => m.OrderDetails),
        canActivate: [authGuard],
      },
    ],
  },
];
