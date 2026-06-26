export type JobStatus = 'new' | 'cable' | 'fusion' | 'connected';
export type UserRole = 'supervisor' | 'cable_tech' | 'fusion_tech' | 'ceo';
export type ReportStatus = 'pending' | 'approved' | 'rejected';
export type ReportType = 'cable' | 'fusion';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  initials: string;
}

export interface Job {
  id: string;
  clientName: string;
  address: string;
  phone: string;
  provider: string;
  status: JobStatus;
  assignedCableTechId: string;
  assignedFusionTechId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CableReport {
  id: string;
  jobId: string;
  submittedById: string;
  clientName: string;
  address: string;
  cableLength: string;
  cableType: string;
  details: string;
  submittedAt: string;
  status: ReportStatus;
  reviewNote: string;
}

export interface FusionReport {
  id: string;
  jobId: string;
  submittedById: string;
  clientName: string;
  address: string;
  pigtails: string;
  adaptors: string;
  atb: string;
  tb: string;
  details: string;
  submittedAt: string;
  status: ReportStatus;
  reviewNote: string;
}
