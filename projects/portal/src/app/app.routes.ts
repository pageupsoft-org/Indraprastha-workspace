import { Routes } from '@angular/router';
import { AppRoutes, MainLayout } from './core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: AppRoutes.LOGIN,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.LOGIN,
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: MainLayout,
    children: [
      // {
      //   path: AppRoutes.DASHBOARD,
      //   loadComponent: () =>
      //     import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      // },
      //  {
      //   path: AppRoutes.EMPLOYEE_LIST,
      //   loadComponent: () =>
      //     import('./pages/employee/employee-list/employee-list').then((m) => m.EmployeeList),
      // },
      //  {
      //   path: AppRoutes.CUSTOMER_LIST,
      //   loadComponent: () =>
      //     import('./pages/customers-list/customers-list').then((m) => m.CustomersList),
      // },
      {
        path: AppRoutes.DASHBOARD,
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: AppRoutes.EMPLOYEE,
        loadComponent: () => import('./pages/employee/list/list').then((m) => m.List),
      },
      {
        path: AppRoutes.CUSTOMER,
        loadComponent: () => import('./pages/customer/list/list').then((m) => m.List),
      },
      {
        path: AppRoutes.COLLECTION,
        loadComponent: () =>
          import('./pages/collection/collection-list/collection-list').then((m) => m.CollectionList),
      },
      {
        path: AppRoutes.CATEGORY,
        loadComponent: () => import('./pages/category/list/list').then((m) => m.List),
      },
      {
        path: AppRoutes.BANNER,
        loadComponent: () => import('./pages/banner/list/list').then((m) => m.List),
      },
      {
        path: AppRoutes.PRODUCT,
        loadComponent: () => import('./pages/product/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: AppRoutes.PRODUCT_UPSERT,
        loadComponent: () =>
          import('./pages/product/product-upsert/product-upsert').then((m) => m.ProductUpsert),
      },

    ],
  },
];
