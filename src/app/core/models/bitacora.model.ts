export interface BitacoraModel {
  id: number;
  register: string;
  bitacoraTypeEnum: 'CONSTANT_UPDATE' | 'CONSTANT_CREATE' | 'CONSTANT_DELETE' | string;
}


