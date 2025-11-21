export interface paramSucursalOccupationsModel {
  sucursalId?: number | null;
}

export interface reportSucursalOccupationsModel {
  sucursalAddress: string;
  sucursalId: number;
  capacity2R: number;
  capacity4R: number;
  current2R: number;
  current4R: number;
}

export interface paramSucursalBillingModel {
  startDate?: string | null;
  endDate?: string | null;
  sucursalId?: number | null;
}

export interface reportSucursalBillingModel{
  sucursal: {
    id: number;
    address: string;
    initHour: string;
    endHour: string;
    capacity2R: number;
    capacity4R: number;
    current2R: number;
    current4R: number;
    appUser: {
      id: number;
      username: string;
      email: string;
      name: string;
    };
  };
  totalGenerated: number;
  totalCoveredByDiscounts: number;
  totalCoveredBySubscriptions: number;
  totalExcessCharged: number;
  tickets: {
    id: number;
    createdAt: string;
    endAt: string;
    price: number;
    realPrice: number;
    discountType: string | null;
  }[];
}


export interface paramSubscriptionModel {
  subscriptionPlanId?: number | null;
  activeOrInactive?: boolean | null;
  userId?: number | null;
  vehiclePlate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  vehicleId?: number | null;
}

export interface reportSubscriptionModel {
  validUntil: string;
  currentHours: number;
  freeHoursPerMonth: number;
  baseDiscount: number;
  yearDiscount: number;
  notes: string | null;
  vehicle: {
    id: number;
    plate: string;
    color: string;
    type: string;
  };
  subscription: {
    id: number;
    name: string;
    freeHoursPerMonth: number;
    pricePerMonth: number;
    baseDiscount: number;
    yearDiscount: number;
    description: string;
    isBySchedule: boolean | null;
    daysBitmask: number;
    days: string[] | null;
    weight: number;
  };
  appUser: {
    id: number;
    email: string;
    phoneNumber: string;
    name: string;
    username: string;
    status: string;
    role: string;
    mfaActivated: boolean;
    daysToPay: number;
  };
}

export interface paramCommerceGivenBenefitsModel {
  startDate?: string | null;
  endDate?: string | null;
  vehiclePlate?: string | null;
  commerceId?: number | null;
  clientId?: number | null;
}

export interface reportCommerceGivenBenefitsModel {
  commerceName: string;
  totalToSettleForCommerce: number;
  sucursalAddress: string;
  discountCost: number;
  freeHours: number;
  vehiclePlate: string;
  benefitedClients: string[];
}

export interface paramIncidentsModel {
  startDate?: string | null;
  endDate?: string | null;
  ticketId?: number | null;
  clientId?: number | null;
  vehiclePlate?: string | null;
  status?: string | null;
  description?: string | null;
}

export interface reportIncidentsModel {
  id: number;
  urlEvidence: string;
  notes: string;
  status: string;
  userHadSubscription: boolean;
  isInGroup: boolean;
}

