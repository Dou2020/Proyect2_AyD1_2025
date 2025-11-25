export interface UserModel {
  id: number;
  email: string;
  phoneNumber: string;
  name: string;
  username: string;
  // se pueden ampliar los literales según los estados/roles reales en la aplicación
  status: 'ACTIVE' | 'INACTIVE' | string;
  role: 'ADMIN' | 'CLIENT' | 'COMMERCE' | 'SUCURSAL' | 'BACKOFFICE' | string;
  mfaActivated: boolean;
  daysToPay: number;
}

export interface UserUpdateModel {
  username: string;
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  mfaActivated: boolean;
}

export interface UserSimpleModel {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface UserSubcursalModel {
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  mfaActivated: boolean;
}

export interface CommerceCreateModel {
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  mfaActivated: boolean;
}

