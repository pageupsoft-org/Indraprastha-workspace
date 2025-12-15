import { Routes } from '@angular/router';
import { appRoutes } from '@website/core';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: appRoutes.HOME,
  },
  {
    path: appRoutes.HOME,
    loadComponent: () => import('./../app/pages/home/home').then((m) => m.Home),
  },
  {
    path: appRoutes.WISHLIST,
    loadComponent: () => import('./../app/pages/wishlist/wishlist').then((m) => m.Wishlist),
  },
  {
    path: appRoutes.ORDER,
    loadComponent: () => import('./../app/pages/order/order').then((m) => m.Order),
  },
  {
    path: appRoutes.REVIEW_RATING,
    loadComponent: () =>
      import('./../app/pages/review-and-rating/review-and-rating').then((m) => m.ReviewAndRating),
  },
  {
    path: appRoutes.PRODUCT_DETAIL,
    loadComponent: () =>
      import('./../app/pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: appRoutes.ORDER_DETAIL,
    loadComponent: () =>
      import('./../app/pages/order-detail/order-detail').then((m) => m.OrderDetail),
  },
  {
    path: appRoutes.CHECKOUT,
    loadComponent: () => import('./../app/pages/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: appRoutes.PRODUCT_DETAIL,
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: appRoutes.WHATS_NEW,
    loadComponent: () =>
      import('./pages/dynamic-catalog/dynamic-catalog').then((m) => m.DynamicCatalog),
  },
  {
    path: appRoutes.COLLECTION,
    loadComponent: () => import('./pages/collections/collections').then((m) => m.Collections),
  },
  {
    path: appRoutes.ABOUT_US,
    loadComponent: () => import('./pages/about-us/about-us').then((m) => m.AboutUs),
  },
  {
    path: appRoutes.SIZE_GUIDE,
    loadComponent: () => import('./pages/size-guide/size-guide').then((m) => m.SizeGuide),
  },
  {
    path: ':path',
    loadComponent: () =>
      import('./pages/dynamic-catalog/dynamic-catalog').then((m) => m.DynamicCatalog),
  },
];
