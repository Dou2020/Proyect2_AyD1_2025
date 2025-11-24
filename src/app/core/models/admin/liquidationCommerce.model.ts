export interface LiquidationCommerceDiscount {
  id: number;
  used: boolean;
  hours: number;
  payedAt: string; // ISO datetime string
  costs: number;
}

export interface LiquidationCommerceModel {
  totalToPay: number;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
  discounts: LiquidationCommerceDiscount[];
}
export interface ParamLiquidationCommerceModel {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
}
