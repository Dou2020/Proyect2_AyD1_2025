export interface IncidentModel {
  id: number;
  urlEvidence: string;
  notes: string;
  status: 'REPORTED' | 'RESOLVED';
  userHadSubscription: boolean;
  isInGroup: boolean;
}

export interface IncidentUpdateModel {
  status: 'REPORTED' | 'RESOLVED';
}

export interface IncidentCreateModel {
  ticketId: number;
  notes: string;
  status: 'REPORTED' | 'RESOLVED';
  isInGroup: boolean;
}
