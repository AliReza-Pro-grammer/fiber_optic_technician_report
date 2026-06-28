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

// Job - only supervisor can edit clientName, virtualNumber, address
export interface Job {
  id: string;
  clientName: string;        // Supervisor only
  virtualNumber: string;      // Supervisor only - unique identifier for the job
  address: string;            // Supervisor only
  phone: string;
  provider: string;
  status: JobStatus;
  assignedCableTechId: string;
  assignedFusionTechId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Cable Report - technician submits material usage
export interface CableReport {
  id: string;
  jobId: string;
  submittedById: string;
  clientName: string;           // Read-only from job
  address: string;              // Read-only from job
  // Fields technician fills:
  doubleBracedCableLength: string;  // Length of Double-braced cable Used (meters)
  threeBracedCableLength: string;   // Length of Three-braced cable Used (meters)
  cableClampCount: string;          // Number of Cable clamps Used
  // Legacy fields (kept for backward compatibility)
  cableLength: string;
  cableType: string;
  details: string;
  submittedAt: string;
  status: ReportStatus;
  reviewNote: string;
}

// Fusion Report - technician submits material usage
export interface FusionReport {
  id: string;
  jobId: string;
  submittedById: string;
  clientName: string;           // Read-only from job
  address: string;              // Read-only from job
  // Fields technician fills:
  atbCount: string;             // Number of ATB used
  pigtailCount: string;         // Number of Pigtails used
  adaptorCount: string;         // Number of Adaptors used
  doubleAdaptorCount: string;   // Number of Double-Adaptors used
  tb8Count: string;             // Number of TB*8 used
  tb4Count: string;             // Number of TB*4 used
  splitterCount: string;        // Number of Splitters used
  cableClampCount: string;      // Number of Cable Clamps used
  // Legacy fields (kept for backward compatibility)
  pigtails: string;
  adaptors: string;
  atb: string;
  tb: string;
  details: string;
  submittedAt: string;
  status: ReportStatus;
  reviewNote: string;
}

// Summary report for supervisor/CEO view
export interface UsedItemsSummary {
  // Cable materials
  totalDoubleBracedCable: number;
  totalThreeBracedCable: number;
  totalCableClamps: number;
  // Fusion materials
  totalATB: number;
  totalPigtails: number;
  totalAdaptors: number;
  totalDoubleAdaptors: number;
  totalTB8: number;
  totalTB4: number;
  totalSplitters: number;
  totalFusionCableClamps: number;
}

export interface TechnicianJobStats {
  technicianId: string;
  technicianName: string;
  role: 'cable_tech' | 'fusion_tech';
  jobsCompleted: number;
  jobsPending: number;
  totalJobs: number;
}
