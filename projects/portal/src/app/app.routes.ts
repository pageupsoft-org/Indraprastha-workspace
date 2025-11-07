import { Routes } from '@angular/router';
import { appRoutes, MainLayout } from '@Core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: appRoutes.LOGIN,
    pathMatch: 'full',
  },
  {
    path: appRoutes.LOGIN,
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: appRoutes.DASHBOARD,
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
       {
        path: appRoutes.EMPLOYEE_LIST,
        loadComponent: () =>
          import('./pages/employee/employee-list/employee-list').then((m) => m.EmployeeList),
      },
       {
        path: appRoutes.CUSTOMER_LIST,
        loadComponent: () =>
          import('./pages/customers-list/customers-list').then((m) => m.CustomersList),
      },
     
    ],
  },
];
