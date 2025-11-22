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
  sucursal: SucursalModel;
  vehicle: VehicleModel;
  discount: DiscountModel;
  createdAt: string;
  endAt: string | null;
  price: number;
  realPrice: number;
  discountType: string;
}

export interface TiketUpdateModel {
  ticketId: string;
  endAt: string;
}
