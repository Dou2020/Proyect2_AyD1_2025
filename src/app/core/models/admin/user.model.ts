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
