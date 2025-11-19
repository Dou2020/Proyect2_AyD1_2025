export interface AppUser {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  mfaActivated?: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
