export interface Discount {
  id: number;
  used: boolean;
  hours: number;
  payedAt: string; // ISO datetime e.g. "2025-11-23T22:12:48.652Z"
  costs: number;
}

export interface LiquidationModel {
  totalToPay: number;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
  discounts: Discount[];
}

export interface ParamLiquidationModel {
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
}
