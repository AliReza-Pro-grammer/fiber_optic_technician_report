import { useMemo } from 'react';
import { useAppContext } from '../app_context';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function useCEOViewModel() {
  const { jobs, cableReports, fusionReports, currentUser, allUsers, navigate, logout } = useAppContext();

  const statusDistribution = useMemo(() => [
    { name: 'New', value: jobs.filter(j => j.status === 'new').length, color: '#1565C0' },
    { name: 'Cable', value: jobs.filter(j => j.status === 'cable').length, color: '#E65100' },
    { name: 'Fusion', value: jobs.filter(j => j.status === 'fusion').length, color: '#BF360C' },
    { name: 'Connected', value: jobs.filter(j => j.status === 'connected').length, color: '#1B5E20' },
  ], [jobs]);

  const completedJobs = useMemo(
    () => jobs.filter(j => j.status === 'connected').sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [jobs]
  );

  const completionRate = jobs.length > 0
    ? Math.round((completedJobs.length / jobs.length) * 100)
    : 0;

  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const count = jobs.filter(j => {
        const jd = new Date(j.updatedAt);
        return j.status === 'connected' && jd.getMonth() === month && jd.getFullYear() === year;
      }).length;
      return { month: MONTH_NAMES[month], count };
    });
  }, [jobs]);

  const approvedCableReports = cableReports.filter(r => r.status === 'approved').length;
  const approvedFusionReports = fusionReports.filter(r => r.status === 'approved').length;
  const pendingCount = [
    ...cableReports.filter(r => r.status === 'pending'),
    ...fusionReports.filter(r => r.status === 'pending'),
  ].length;

  const getUserById = (id: string) => allUsers.find(u => u.id === id);

  return {
    currentUser, statusDistribution, completedJobs, completionRate, monthlyData,
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status !== 'connected').length,
    approvedReports: approvedCableReports + approvedFusionReports,
    pendingCount,
    getUserById,
    navigate, logout,
  };
}
