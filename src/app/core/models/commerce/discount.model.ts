
export interface DiscountModel {
  id: number;
  used: boolean;
  hours: number;
  payedAt: string;
  costs: number;
}
export interface ParamDiscountModel {
  startDate: string | null; // 'YYYY-MM-DD'
  endDate: string | null;   // 'YYYY-MM-DD'
  plate: string | null;
  ticketId: number | null;
}

export interface DiscountCreateModel {
  hours: number;
  ticketIdOrPlate: string;
}
