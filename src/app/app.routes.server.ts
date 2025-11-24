import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/subcursales/:id/comercios',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/subcursales/:id/tarifas',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/commerce/branch/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/grupos/:groupId/tickets',
    renderMode: RenderMode.Server
  },
  {
    path: 'client/vehicles/facturation/:vehicleId',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
