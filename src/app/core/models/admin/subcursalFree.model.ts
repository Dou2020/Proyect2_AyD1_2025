export interface SubcursalFreeModel {
  id: number;
  initHour: string;
  endHour: string;
  price: number;
  sucursalId: number;
}

export interface SubcursalFreeCreateModel {
  initHour: string;
  endHour: string;
  price: number;
}
