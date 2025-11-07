import { SafeHtml } from "@angular/platform-browser";
import { appRoutes } from "@Core";

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
        route: appRoutes.DASHBOARD,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
    {
        name: 'Employee',
        route: appRoutes.EMPLOYEE_LIST,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
    {
        name: 'Customers',
        route: appRoutes.CUSTOMER_LIST,
        icon: 'bx bxs-dashboard',
        userType: [],
        child: [],
    },
]