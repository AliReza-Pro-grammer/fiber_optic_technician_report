import { useMemo } from 'react';
import { useAppContext } from '../app_context';

export function useCableTechViewModel() {
  const { jobs, cableReports, currentUser, navigate, goBack, submitCableReport, logout } = useAppContext();

  const assignedJobs = useMemo(
    () => jobs.filter(j => j.assignedCableTechId === currentUser?.id),
    [jobs, currentUser]
  );

  const todoJobs = useMemo(
    () => assignedJobs.filter(j => j.status === 'new'),
    [assignedJobs]
  );

  const inProgressJobs = useMemo(
    () => assignedJobs.filter(j => j.status === 'cable'),
    [assignedJobs]
  );

  const completedJobs = useMemo(
    () => assignedJobs.filter(j => j.status === 'fusion' || j.status === 'connected'),
    [assignedJobs]
  );

  const hasSubmittedReport = (jobId: string) =>
    cableReports.some(r => r.jobId === jobId);

  const getReportStatus = (jobId: string) =>
    cableReports.find(r => r.jobId === jobId)?.status;

  return {
    currentUser, todoJobs, inProgressJobs, completedJobs, assignedJobs,
    hasSubmittedReport, getReportStatus,
    navigate, goBack, submitCableReport, logout,
  };
}

export function useFusionTechViewModel() {
  const { jobs, fusionReports, currentUser, navigate, goBack, submitFusionReport, logout } = useAppContext();

  const assignedJobs = useMemo(
    () => jobs.filter(j => j.assignedFusionTechId === currentUser?.id),
    [jobs, currentUser]
  );

  const todoJobs = useMemo(
    () => assignedJobs.filter(j => j.status === 'cable'),
    [assignedJobs]
  );

  const inProgressJobs = useMemo(
    () => assignedJobs.filter(j => j.status === 'fusion'),
    [assignedJobs]
  );

  const completedJobs = useMemo(
    () => assignedJobs.filter(j => j.status === 'connected'),
    [assignedJobs]
  );

  const hasSubmittedReport = (jobId: string) =>
    fusionReports.some(r => r.jobId === jobId);

  const getReportStatus = (jobId: string) =>
    fusionReports.find(r => r.jobId === jobId)?.status;

  return {
    currentUser, todoJobs, inProgressJobs, completedJobs, assignedJobs,
    hasSubmittedReport, getReportStatus,
    navigate, goBack, submitFusionReport, logout,
  };
}
