import { SafeHtml } from "@angular/platform-browser";
import { AppRoutes } from "@portal/core";
// import 'boxicons'

export interface IMenuItem {
    name: string;
    route: string;
    icon: string | SafeHtml;
    userType: string[];
}
export interface IMenuSideBarItem extends IMenuItem {
    child: IMenuItem[],
    expanded?: boolean;
}


export const MenuItems: IMenuSideBarItem[] = [
    {
        name: 'Dashboard',
        route: AppRoutes.DASHBOARD,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
    {
        name: 'Employee',
        route: AppRoutes.EMPLOYEE,
        icon: 'bx bx-sun',
        userType: [],
        child: [],
    },
    {
        name: 'Customers',
        route: AppRoutes.CUSTOMER,
        icon: 'bx bx-user',
        userType: [],
        child: [],
    },
     {
        name: 'Collection',
        route: AppRoutes.COLLECTION,
        icon: 'bx bxs-store-alt',
        userType: [],
        child: [],
    },
      {
        name: 'Category',
        route: AppRoutes.CATEGORY,
        icon: 'bx bx-layer',
        userType: [],
        child: [],
    },
    {
        name: 'Banner',
        route: AppRoutes.BANNER,
        icon: 'bx bx-receipt',
        userType: [],
        child: [],
    },
     {
        name: 'Product',
        route: AppRoutes.PRODUCT,
        icon: 'bx bxs-package',
        userType: [],
        child: [],
    },
    {
        name: 'Orders',
        route: AppRoutes.ORDERS,
        icon: 'bx bx-coin-stack',
        userType: [],
        child: [],
    },
   
]