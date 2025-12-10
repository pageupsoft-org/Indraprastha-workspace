import { RenderMode, ServerRoute } from '@angular/ssr';
import { appRoutes } from '@website/core';

export const serverRoutes: ServerRoute[] = [
  {
    path: appRoutes.ABOUT_US,
    renderMode: RenderMode.Prerender,
  },
  {
    path: appRoutes.HOME,
    renderMode: RenderMode.Prerender,
  },
  {
    path: appRoutes.WISHLIST,
    renderMode: RenderMode.Client,
  },
  {
    path: appRoutes.ORDER,
    renderMode: RenderMode.Client,
  },
  {
    path: appRoutes.REVIEW_RATING,
    renderMode: RenderMode.Client,
  },
  {
    path: appRoutes.ORDER_DETAIL,
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
