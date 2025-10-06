export interface AppUser {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
