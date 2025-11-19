import { UserSimpleModel, UserSubcursalModel } from "./user.model";

export interface SubcursalModel {
  id: number;
  address: string;
  initHour: string;
  endHour: string;
  capacity2R: number;
  capacity4R: number;
  current2R: number;
  current4R: number;
  appUser: UserSimpleModel;
}

export interface SubcursalCreateModel {
  address: string;
  initHour: string;
  endHour: string;
  capacity2R: number;
  capacity4R: number;
  appUser: UserSubcursalModel;
}

export interface SubcursalUpdateModel {
  address?: string;
  initHour?: string;
  endHour?: string;
  capacity2R?: number;
  capacity4R?: number;
}


