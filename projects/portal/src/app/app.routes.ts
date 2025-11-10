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
      {
        path: AppRoutes.DASHBOARD,
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
       {
        path: AppRoutes.EMPLOYEE_LIST,
        loadComponent: () =>
          import('./pages/employee/employee-list/employee-list').then((m) => m.EmployeeList),
      },
       {
        path: AppRoutes.CUSTOMER_LIST,
        loadComponent: () =>
          import('./pages/customers-list/customers-list').then((m) => m.CustomersList),
      },
     
    ],
  },
];
