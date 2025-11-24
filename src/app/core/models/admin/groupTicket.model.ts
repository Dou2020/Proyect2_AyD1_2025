export interface GroupCreateModel {
  groupId: number;
  quantity: number;
}

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
  payedAt: string; // ISO date string
  costs: number;
}

export interface TicketModel {
  id: number;
  sucursal: SucursalModel;
  vehicle: VehicleModel;
  discount: DiscountModel | null;
  createdAt: string; // ISO date string
  endAt: string; // ISO date string
  price: number;
  realPrice: number;
  discountType: string;
}

export interface GroupTicketModel {
  id: number;
  groupId: number;
  quantity: number;
  extraCost: number;
  isAvailable: boolean;
  ticket: TicketModel | null;
}
