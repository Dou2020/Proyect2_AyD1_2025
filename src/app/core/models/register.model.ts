export interface RegisterModel {
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'CLIENT'; // e.g. "ADMIN"
  mfaActivated: boolean;
}
