import { Job, CableReport, FusionReport } from '../domain/entities';
import { MOCK_JOBS, MOCK_CABLE_REPORTS, MOCK_FUSION_REPORTS } from './mock_data';

const KEYS = {
  JOBS:           'fiberops:jobs',
  CABLE_REPORTS:  'fiberops:cable_reports',
  FUSION_REPORTS: 'fiberops:fusion_reports',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage unavailable (e.g. private browsing)
  }
}

export const JobStorage = {
  loadJobs:            (): Job[]          => load(KEYS.JOBS, MOCK_JOBS),
  saveJobs:            (v: Job[])         => save(KEYS.JOBS, v),

  loadCableReports:    (): CableReport[]  => load(KEYS.CABLE_REPORTS, MOCK_CABLE_REPORTS),
  saveCableReports:    (v: CableReport[]) => save(KEYS.CABLE_REPORTS, v),

  loadFusionReports:   (): FusionReport[] => load(KEYS.FUSION_REPORTS, MOCK_FUSION_REPORTS),
  saveFusionReports:   (v: FusionReport[])=> save(KEYS.FUSION_REPORTS, v),

  clearAll: () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),
};
