export interface SucursalStat {
  sucursalId: number;
  ingresos: number;
  egresos: number;
  generado: number;
  actual2R: number;
  actual4R: number;
  tiempoPromedio: number;
}

export interface DashboardModel {
  ingresos: number;
  egresos: number;
  generado: number;
  actual2R: number;
  actual4R: number;
  tiempoPromedio: number;
  sucursalStats: SucursalStat[];
}

export interface DashboardSucursalModel {
  sucursalId: number;
  ingresos: number;
  egresos: number;
  generado: number;
  actual2R: number;
  actual4R: number;
  tiempoPromedio: number;
}

export interface DashboardSucursalUpdateModel {
  sucursalId: number;
  ingresos: number;
  egresos: number;
  generado: number;
  actual2R: number;
  actual4R: number;
  tiempoPromedio: number;
}
