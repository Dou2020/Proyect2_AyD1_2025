import { SubcursalModel } from './subcursal.model';

export interface CommerceModel {
  id: number;
  email: string;
  phoneNumber: string;
  name: string;
  username: string;
  status: string;
  role: string;
  mfaActivated: boolean;
  daysToPay: number;
}
export interface CommerceCreateModel {
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  mfaActivated: boolean;
}

export interface CommerceAffiliateCreateModel {
  commerceId: number;
  subcursalId: number;
}

export interface AffiliateCommerceModel {
  id: number;
  commerce: CommerceModel;
}

export interface AffiliateSubcursalModel {
  id: number;
  subcursal: SubcursalModel;
}
