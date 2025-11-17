import { SafeHtml } from "@angular/platform-browser";
import { AppRoutes } from "@portal/core";

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
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
    {
        name: 'Customers',
        route: AppRoutes.CUSTOMER,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
     {
        name: 'Collection',
        route: AppRoutes.COLLECTION,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
      {
        name: 'Category',
        route: AppRoutes.CATEGORY,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
    {
        name: 'Banner',
        route: AppRoutes.BANNER,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
     {
        name: 'Product',
        route: AppRoutes.PRODUCT,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
    {
        name: 'Orders',
        route: AppRoutes.ORDERS,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
]