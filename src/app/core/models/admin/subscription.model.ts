export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface SubscriptionDTO {
  id: number;
  name: string;
  freeHoursPerMonth: number;
  pricePerMonth: number;
  baseDiscount: number;
  yearDiscount: number;
  description?: string | null;
  isBySchedule?: boolean | null;
  daysBitmask?: number;
  days?: WeekDay[];
  weight?: number;
}

/**
 * Modelo para una suscripción (subscription) como interface.
 * Se proveen funciones utilitarias para crear/serializar y convertir días <-> bitmask.
 */
export interface SubscriptionModel {
  id: number;
  name: string;
  freeHoursPerMonth: number;
  pricePerMonth: number;
  baseDiscount: number;
  yearDiscount: number;
  description?: string | null;
  isBySchedule?: boolean | null;
  daysBitmask: number;
  days: WeekDay[];
  weight: number;
}

const WEEKDAY_ORDER: WeekDay[] = [
  WeekDay.MONDAY,
  WeekDay.TUESDAY,
  WeekDay.WEDNESDAY,
  WeekDay.THURSDAY,
  WeekDay.FRIDAY,
  WeekDay.SATURDAY,
  WeekDay.SUNDAY,
];

export function daysToBitmask(days: WeekDay[]): number {
  let mask = 0;
  for (const d of days) {
    const idx = WEEKDAY_ORDER.indexOf(d);
    if (idx >= 0) mask |= 1 << idx;
  }
  return mask;
}

export function bitmaskToDays(mask: number): WeekDay[] {
  const out: WeekDay[] = [];
  for (let i = 0; i < WEEKDAY_ORDER.length; i++) {
    if ((mask & (1 << i)) !== 0) out.push(WEEKDAY_ORDER[i]);
  }
  return out;
}

export function createSubscription(data: SubscriptionDTO): SubscriptionModel {
  const computedDaysBitmask = data.daysBitmask ?? daysToBitmask(data.days ?? []);
  const days = data.days ?? bitmaskToDays(computedDaysBitmask);

  return {
    id: data.id,
    name: data.name,
    freeHoursPerMonth: data.freeHoursPerMonth,
    pricePerMonth: data.pricePerMonth,
    baseDiscount: data.baseDiscount,
    yearDiscount: data.yearDiscount,
    description: data.description ?? null,
    isBySchedule: data.isBySchedule ?? null,
    daysBitmask: computedDaysBitmask,
    days,
    weight: data.weight ?? 0,
  };
}

export function subscriptionToDTO(s: SubscriptionModel): SubscriptionDTO {
  return {
    id: s.id,
    name: s.name,
    freeHoursPerMonth: s.freeHoursPerMonth,
    pricePerMonth: s.pricePerMonth,
    baseDiscount: s.baseDiscount,
    yearDiscount: s.yearDiscount,
    description: s.description,
    isBySchedule: s.isBySchedule,
    daysBitmask: s.daysBitmask,
    days: s.days.slice(),
    weight: s.weight,
  };
}
