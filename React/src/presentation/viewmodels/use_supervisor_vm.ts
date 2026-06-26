import { useMemo } from 'react';
import { useAppContext } from '../app_context';
import { JobStatus } from '../../domain/entities';

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

  const filterJobs = (status?: JobStatus) =>
    status ? jobs.filter(j => j.status === status) : jobs;

  const getUserById = (id: string) => allUsers.find(u => u.id === id);

  const getCableReport = (jobId: string) => cableReports.find(r => r.jobId === jobId);
  const getFusionReport = (jobId: string) => fusionReports.find(r => r.jobId === jobId);

  return {
    jobStats, pendingReports, allReports, jobs,
    filterJobs, getUserById, getCableReport, getFusionReport,
    navigate, addJob, approveReport, rejectReport, updateJobStatus, goBack, logout,
  };
}
