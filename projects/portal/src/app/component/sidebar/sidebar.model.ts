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
        route: AppRoutes.EMPLOYEE_LIST,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
    {
        name: 'Customers',
        route: AppRoutes.CUSTOMER_LIST,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
]