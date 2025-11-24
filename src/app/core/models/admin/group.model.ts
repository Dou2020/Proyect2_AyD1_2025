export interface AppUserModel {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface SucursalModel {
  id: number;
  address: string;
  initHour: string;
  endHour: string;
  capacity2R: number;
  capacity4R: number;
  current2R: number;
  current4R: number;
  appUser: AppUserModel;
}

export interface GroupModel {
  id: number;
  sucursal: SucursalModel;
  discount: number;
  from: string; // ISO date string (ej. "2025-11-24")
  to: string;   // ISO date string
}

export interface GroupCreateModel {
  sucursalId: number;
  commerceId: number;
  discount: number;
  from: string; // ISO date string (ej. "2025-11-24")
  to: string;   // ISO date string
}

