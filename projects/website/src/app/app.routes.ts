import { Routes } from '@angular/router';
import { appRoutes } from './core/const/appRoutes.const';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: appRoutes.HOME
    },
    {
        path: appRoutes.HOME,
        loadComponent: () => import('./../app/pages/home/home').then(m => m.Home)
    },
    {
        path: appRoutes.WISHLIST,
        loadComponent: () => import('./../app/pages/wishlist/wishlist').then(m => m.Wishlist)
    },
    {
        path: appRoutes.PRODUCTDETAIL,
        loadComponent: () => import('./../app/pages/product-detail/product-detail').then(m => m.ProductDetail)
    },
    {
        path: appRoutes.CHECKOUT,
        loadComponent: () => import('./../app/pages/checkout/checkout').then(m => m.Checkout)
    },
    {
        path: ':path',
        loadComponent: () => import('./pages/dynamic-catalog/dynamic-catalog').then(m => m.DynamicCatalog)
    },
];
