import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/commerce/branch/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/subcursales/:id/comercios',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/subcursales/:id/tarifas',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/commerce/branch/*',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
