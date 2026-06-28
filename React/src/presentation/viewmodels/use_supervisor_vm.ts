import { useMemo } from 'react';
import { useAppContext } from '../app_context';
import { JobStatus, UsedItemsSummary, TechnicianJobStats, CableReport, FusionReport } from '../../domain/entities';

export function useSupervisorViewModel() {
  const { jobs, cableReports, fusionReports, allUsers, navigate, addJob, approveReport, rejectReport, updateJobStatus, goBack, logout } = useAppContext();

  const jobStats = useMemo(() => ({
    new: jobs.filter(j => j.status === 'new').length,
    cable: jobs.filter(j => j.status === 'cable').length,
    fusion: jobs.filter(j => j.status === 'fusion').length,
    connected: jobs.filter(j => j.status === 'connected').length,
    total: jobs.length,
  }), [jobs]);

  const pendingReports = useMemo(() => {
    const cable = cableReports
      .filter(r => r.status === 'pending')
      .map(r => ({ ...r, reportType: 'cable' as const }));
    const fusion = fusionReports
      .filter(r => r.status === 'pending')
      .map(r => ({ ...r, reportType: 'fusion' as const }));
    return [...cable, ...fusion].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [cableReports, fusionReports]);

  const allReports = useMemo(() => {
    const cable = cableReports.map(r => ({ ...r, reportType: 'cable' as const }));
    const fusion = fusionReports.map(r => ({ ...r, reportType: 'fusion' as const }));
    return [...cable, ...fusion].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [cableReports, fusionReports]);

  // Calculate total used items summary across all approved reports
  const usedItemsSummary = useMemo((): UsedItemsSummary => {
    // Only count approved reports
    const approvedCable = cableReports.filter(r => r.status === 'approved');
    const approvedFusion = fusionReports.filter(r => r.status === 'approved');

    return {
      // Cable materials
      totalDoubleBracedCable: approvedCable.reduce((sum, r) => sum + (Number(r.doubleBracedCableLength) || 0), 0),
      totalThreeBracedCable: approvedCable.reduce((sum, r) => sum + (Number(r.threeBracedCableLength) || 0), 0),
      totalCableClamps: approvedCable.reduce((sum, r) => sum + (Number(r.cableClampCount) || 0), 0),
      // Fusion materials
      totalATB: approvedFusion.reduce((sum, r) => sum + (Number(r.atbCount) || 0), 0),
      totalPigtails: approvedFusion.reduce((sum, r) => sum + (Number(r.pigtailCount) || 0), 0),
      totalAdaptors: approvedFusion.reduce((sum, r) => sum + (Number(r.adaptorCount) || 0), 0),
      totalDoubleAdaptors: approvedFusion.reduce((sum, r) => sum + (Number(r.doubleAdaptorCount) || 0), 0),
      totalTB8: approvedFusion.reduce((sum, r) => sum + (Number(r.tb8Count) || 0), 0),
      totalTB4: approvedFusion.reduce((sum, r) => sum + (Number(r.tb4Count) || 0), 0),
      totalSplitters: approvedFusion.reduce((sum, r) => sum + (Number(r.splitterCount) || 0), 0),
      totalFusionCableClamps: approvedFusion.reduce((sum, r) => sum + (Number(r.cableClampCount) || 0), 0),
    };
  }, [cableReports, fusionReports]);

  // Calculate job stats by technician role
  const technicianStats = useMemo((): TechnicianJobStats[] => {
    const cableTechs = allUsers.filter(u => u.role === 'cable_tech');
    const fusionTechs = allUsers.filter(u => u.role === 'fusion_tech');

    const stats: TechnicianJobStats[] = [];

    cableTechs.forEach(tech => {
      const techJobs = jobs.filter(j => j.assignedCableTechId === tech.id);
      const techCableReports = cableReports.filter(r => r.submittedById === tech.id && r.status === 'approved');
      stats.push({
        technicianId: tech.id,
        technicianName: tech.name,
        role: 'cable_tech',
        jobsCompleted: techCableReports.length,
        jobsPending: techJobs.filter(j => j.status === 'new' || j.status === 'cable').length,
        totalJobs: techJobs.length,
      });
    });

    fusionTechs.forEach(tech => {
      const techJobs = jobs.filter(j => j.assignedFusionTechId === tech.id);
      const techFusionReports = fusionReports.filter(r => r.submittedById === tech.id && r.status === 'approved');
      stats.push({
        technicianId: tech.id,
        technicianName: tech.name,
        role: 'fusion_tech',
        jobsCompleted: techFusionReports.length,
        jobsPending: techJobs.filter(j => j.status === 'cable' || j.status === 'fusion').length,
        totalJobs: techJobs.length,
      });
    });

    return stats;
  }, [jobs, cableReports, fusionReports, allUsers]);

  const filterJobs = (status?: JobStatus) =>
    status ? jobs.filter(j => j.status === status) : jobs;

  const getUserById = (id: string) => allUsers.find(u => u.id === id);

  const getCableReport = (jobId: string) => cableReports.find(r => r.jobId === jobId);
  const getFusionReport = (jobId: string) => fusionReports.find(r => r.jobId === jobId);

  // Get job by ID (for editing)
  const getJobById = (id: string) => jobs.find(j => j.id === id);

  return {
    jobStats, pendingReports, allReports, jobs, cableReports, fusionReports, usedItemsSummary, technicianStats,
    filterJobs, getUserById, getCableReport, getFusionReport, getJobById,
    navigate, addJob, approveReport, rejectReport, updateJobStatus, goBack, logout,
  };
}
