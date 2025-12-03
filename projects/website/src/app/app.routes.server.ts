import { RenderMode, ServerRoute } from '@angular/ssr';
import { appRoutes } from '@website/core';

export const serverRoutes: ServerRoute[] = [
  {
    path: appRoutes.WISHLIST,
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
