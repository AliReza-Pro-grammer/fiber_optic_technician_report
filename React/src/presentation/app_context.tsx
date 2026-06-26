import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Job, CableReport, FusionReport, JobStatus, ReportType, UserRole } from '../domain/entities';
import { MOCK_USERS } from '../data/mock_data';
import { JobStorage } from '../data/persistence';
import { NotificationService } from '../data/notification_service';

export type ScreenName =
  | 'login'
  | 'supervisor_home'
  | 'supervisor_reports'
  | 'supervisor_report_detail'
  | 'cable_home'
  | 'cable_report_form'
  | 'fusion_home'
  | 'fusion_report_form'
  | 'ceo_home';

export interface NavParams {
  jobId?: string;
  reportType?: ReportType;
}

export interface NavState {
  screen: ScreenName;
  params?: NavParams;
}

interface AppContextType {
  currentUser: User | null;
  jobs: Job[];
  cableReports: CableReport[];
  fusionReports: FusionReport[];
  navState: NavState;
  allUsers: User[];

  login: (user: User) => void;
  logout: () => void;
  navigate: (screen: ScreenName, params?: NavParams) => void;
  goBack: () => void;

  addJob: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  submitCableReport: (data: Omit<CableReport, 'id' | 'submittedAt' | 'status' | 'reviewNote'>) => void;
  submitFusionReport: (data: Omit<FusionReport, 'id' | 'submittedAt' | 'status' | 'reviewNote'>) => void;
  approveReport: (jobId: string, type: ReportType) => void;
  rejectReport: (jobId: string, type: ReportType, note: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function getRoleHome(role: UserRole): ScreenName {
  switch (role) {
    case 'supervisor': return 'supervisor_home';
    case 'cable_tech': return 'cable_home';
    case 'fusion_tech': return 'fusion_home';
    case 'ceo': return 'ceo_home';
  }
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(() => JobStorage.loadJobs());
  const [cableReports, setCableReports] = useState<CableReport[]>(() => JobStorage.loadCableReports());
  const [fusionReports, setFusionReports] = useState<FusionReport[]>(() => JobStorage.loadFusionReports());
  const [navState, setNavState] = useState<NavState>({ screen: 'login' });
  const [navHistory, setNavHistory] = useState<NavState[]>([]);

  // Persist to localStorage whenever state changes
  useEffect(() => { JobStorage.saveJobs(jobs); }, [jobs]);
  useEffect(() => { JobStorage.saveCableReports(cableReports); }, [cableReports]);
  useEffect(() => { JobStorage.saveFusionReports(fusionReports); }, [fusionReports]);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
    const home = getRoleHome(user.role);
    setNavState({ screen: home });
    setNavHistory([]);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setNavState({ screen: 'login' });
    setNavHistory([]);
  }, []);

  const navigate = useCallback((screen: ScreenName, params?: NavParams) => {
    setNavHistory(prev => [...prev, navState]);
    setNavState({ screen, params });
  }, [navState]);

  const goBack = useCallback(() => {
    setNavHistory(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setNavState(last);
      return prev.slice(0, -1);
    });
  }, []);

  const addJob = useCallback((data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newJob: Job = {
      ...data,
      id: `J${String(Date.now()).slice(-3)}`,
      createdAt: now,
      updatedAt: now,
    };
    setJobs(prev => [newJob, ...prev]);
  }, []);

  const updateJobStatus = useCallback((jobId: string, status: JobStatus) => {
    setJobs(prev => prev.map(j =>
      j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString() } : j
    ));
  }, []);

  const submitCableReport = useCallback((data: Omit<CableReport, 'id' | 'submittedAt' | 'status' | 'reviewNote'>) => {
    const report: CableReport = {
      ...data, id: `CR${String(Date.now()).slice(-4)}`,
      submittedAt: new Date().toISOString(), status: 'pending', reviewNote: '',
    };
    setCableReports(prev => [...prev, report]);
    setJobs(prev => prev.map(j =>
      j.id === data.jobId ? { ...j, status: 'cable', updatedAt: new Date().toISOString() } : j
    ));
    NotificationService.send(
      'FiberOps — Cable Report Submitted',
      `${data.clientName} · Job #${data.jobId} is awaiting supervisor review.`,
      `cable-report-${data.jobId}`,
    );
  }, []);

  const submitFusionReport = useCallback((data: Omit<FusionReport, 'id' | 'submittedAt' | 'status' | 'reviewNote'>) => {
    const report: FusionReport = {
      ...data, id: `FR${String(Date.now()).slice(-4)}`,
      submittedAt: new Date().toISOString(), status: 'pending', reviewNote: '',
    };
    setFusionReports(prev => [...prev, report]);
    setJobs(prev => prev.map(j =>
      j.id === data.jobId ? { ...j, status: 'fusion', updatedAt: new Date().toISOString() } : j
    ));
    NotificationService.send(
      'FiberOps — Fusion Report Submitted',
      `${data.clientName} · Job #${data.jobId} is awaiting supervisor review.`,
      `fusion-report-${data.jobId}`,
    );
  }, []);

  const approveReport = useCallback((jobId: string, type: ReportType) => {
    if (type === 'cable') {
      setCableReports(prev => prev.map(r => r.jobId === jobId ? { ...r, status: 'approved' } : r));
      setJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, status: 'fusion', updatedAt: new Date().toISOString() } : j
      ));
    } else {
      setFusionReports(prev => prev.map(r => r.jobId === jobId ? { ...r, status: 'approved' } : r));
      setJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, status: 'connected', updatedAt: new Date().toISOString() } : j
      ));
    }
  }, []);

  const rejectReport = useCallback((jobId: string, type: ReportType, note: string) => {
    if (type === 'cable') {
      setCableReports(prev => prev.map(r => r.jobId === jobId ? { ...r, status: 'rejected', reviewNote: note } : r));
    } else {
      setFusionReports(prev => prev.map(r => r.jobId === jobId ? { ...r, status: 'rejected', reviewNote: note } : r));
    }
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, jobs, cableReports, fusionReports, navState, allUsers: MOCK_USERS,
      login, logout, navigate, goBack,
      addJob, updateJobStatus, submitCableReport, submitFusionReport, approveReport, rejectReport,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
