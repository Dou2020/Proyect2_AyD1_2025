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
    path: 'admin/dashboard/sucursal/:sucursalId',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/subcursales/:id/dashboard',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/liquidation-commerce/:commerceId',
    renderMode: RenderMode.Server
  },
  {
    path: 'groups/tickets/:groupId',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
