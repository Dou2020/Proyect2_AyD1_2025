export interface TemporalTransferModel {
  id: number;
  evidenceUrl: string | null;
  status: 'PENDING' | 'OK' | 'REJECTED' | 'FINISHED' | 'BANNED';

  vehicleSubscription: {
    validUntil: string;
    currentHours: number;
    freeHoursPerMonth: number;
    baseDiscount: number;
    yearDiscount: number;
    notes: string | null;
  };

  originalVehicle: {
    plate: string;
    color: string;
    type: string;
  };

  secondVehicle: {
    plate: string;
    color: string;
    type: string;
  };

  reason: string;
  justification: string;
  validFrom: string;
  validUntil: string;
}
