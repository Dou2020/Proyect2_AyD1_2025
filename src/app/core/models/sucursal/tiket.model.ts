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
  appUser: AppUserModel | null;
}

export interface VehicleModel {
  id: number;
  plate: string;
  color: string;
  type: string;
}

export interface DiscountModel {
  id: number;
  used: boolean;
  hours: number;
  payedAt: string | null;
  costs: number;
}

export interface TiketModel {
  id: number;
  sucursal: SucursalModel | null;
  vehicle: VehicleModel | null;
  discount: DiscountModel | null;
  createdAt: string | null;
  endAt: string | null;
  price: number | null;
  realPrice: number | null;
  discountType: string | null;
}

export interface TiketUpdateModel {
  ticketId: string;
  endAt: string;
}
