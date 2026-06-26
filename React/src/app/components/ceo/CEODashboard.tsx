import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BusinessIcon from '@mui/icons-material/Business';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAppContext } from '../../../presentation/app_context';
import { generateReportHTML } from './report_generator';
import { toast } from 'sonner';
import { useCEOViewModel } from '../../../presentation/viewmodels/use_ceo_vm';
import { JobStatusChip } from '../shared/StatusChip';

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function KpiCard({ label, value, sub, icon, color, bg }: KpiCardProps) {
  return (
    <Box sx={{
      bgcolor: 'white', borderRadius: '14px', p: '14px',
      boxShadow: '0 2px 10px rgba(10,36,99,0.07)',
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      border: `1px solid ${bg}`,
    }}>
      <Box sx={{
        width: 40, height: 40, borderRadius: '12px',
        bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.35rem', color: '#1A1A2E', lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#78909C', mt: '2px', fontWeight: 500 }}>{label}</Typography>
        {sub && <Typography sx={{ fontSize: '0.65rem', color, mt: '2px', fontWeight: 600 }}>{sub}</Typography>}
      </Box>
    </Box>
  );
}

export function CEODashboard() {
  const vm = useCEOViewModel();
  const { jobs: allJobs, cableReports, fusionReports } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);

  const handleExportPDF = useCallback(() => {
    const win = window.open('', '_blank', 'width=960,height=700,scrollbars=yes');
    if (!win) {
      toast.error('Pop-up blocked — please allow pop-ups for this site.');
      return;
    }
    const html = generateReportHTML({
      generatedBy: vm.currentUser?.name ?? 'CEO',
      jobs: allJobs,
      cableReports,
      fusionReports,
      statusDistribution: vm.statusDistribution,
      completionRate: vm.completionRate,
    });
    win.document.write(html);
    win.document.close();
    toast.success('Report opened — use Print / Ctrl+P to save as PDF');
  }, [vm, allJobs, cableReports, fusionReports]);

  const pieColors = vm.statusDistribution.map(d => d.color);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8' }}>
      <AppBar position="static" sx={{ bgcolor: '#0A2463' }}>
        <Toolbar sx={{ minHeight: '52px !important', px: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>Executive Overview</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>
              {vm.currentUser?.name}
            </Typography>
          </Box>
          <Box sx={{
            width: 36, height: 36, borderRadius: '50%',
            bgcolor: '#1B5E20', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.82rem', color: 'white', mr: 1,
          }}>
            {vm.currentUser?.initials}
          </Box>
          <IconButton
            onClick={handleExportPDF}
            sx={{ color: 'rgba(255,255,255,0.85)', p: '8px' }}
            title="Export PDF Report"
          >
            <PictureAsPdfIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={vm.logout} sx={{ color: 'rgba(255,255,255,0.7)', p: '8px' }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {/* KPI Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', mb: 2 }}>
          <KpiCard
            label="Total Jobs"
            value={vm.totalJobs}
            icon={<BusinessIcon sx={{ fontSize: 20 }} />}
            color="#0A2463" bg="#E8EDF9"
          />
          <KpiCard
            label="Completion Rate"
            value={`${vm.completionRate}%`}
            sub="On target"
            icon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
            color="#1B5E20" bg="#E8F5E9"
          />
          <KpiCard
            label="Active Jobs"
            value={vm.activeJobs}
            icon={<PendingActionsIcon sx={{ fontSize: 20 }} />}
            color="#E65100" bg="#FFF3E0"
          />
          <KpiCard
            label="Reports Approved"
            value={vm.approvedReports}
            sub={`${vm.pendingCount} pending`}
            icon={<CheckCircleIcon sx={{ fontSize: 20 }} />}
            color="#1565C0" bg="#E3F2FD"
          />
        </Box>

        {/* Pie Chart */}
        <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '14px', mb: 2, boxShadow: '0 2px 10px rgba(10,36,99,0.07)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1A1A2E', mb: '2px' }}>
            Job Status Distribution
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#90A4AE', mb: '10px' }}>
            Current pipeline breakdown
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="55%" height={150}>
              <PieChart>
                <Pie
                  data={vm.statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={30}
                  labelLine={false}
                >
                  {vm.statusDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} jobs`]} />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {vm.statusDistribution.map(d => (
                <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#546E7A', flex: 1 }}>{d.name}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#1A1A2E', fontWeight: 700 }}>{d.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Bar Chart */}
        <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '14px', mb: 2, boxShadow: '0 2px 10px rgba(10,36,99,0.07)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1A1A2E', mb: '2px' }}>
            Monthly Completions
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#90A4AE', mb: '10px' }}>
            Jobs connected in last 6 months
          </Typography>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={vm.monthlyData} barSize={20} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#90A4AE' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#90A4AE' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '0.75rem' }}
                formatter={(v: number) => [`${v} jobs`, 'Connected']}
              />
              <Bar dataKey="count" fill="#1B5E20" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Completed jobs */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '10px' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0A2463', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Completed Jobs ({vm.completedJobs.length})
          </Typography>
          <Button
            size="small"
            startIcon={<PictureAsPdfIcon sx={{ fontSize: '14px !important' }} />}
            onClick={handleExportPDF}
            sx={{
              fontSize: '0.7rem', borderRadius: '8px', py: '4px', px: '10px',
              bgcolor: '#0A2463', color: 'white', boxShadow: 'none',
              '&:hover': { bgcolor: '#1A3A8F' },
            }}
          >
            Export PDF
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: 1 }}>
          {vm.completedJobs.map(job => (
            <Box key={job.id} sx={{
              bgcolor: 'white', borderRadius: '12px', p: '12px',
              boxShadow: '0 2px 8px rgba(10,36,99,0.06)',
              display: 'flex', alignItems: 'center', gap: '10px',
              borderLeft: '4px solid #2E7D32',
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1A1A2E' }}>{job.clientName}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#90A4AE' }}>{job.address}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '4px' }}>
                  <Typography sx={{ fontSize: '0.65rem', color: '#B0BEC5' }}>#{job.id}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#B0BEC5' }}>{job.provider}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#B0BEC5' }}>
                    {new Date(job.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </Typography>
                </Box>
              </Box>
              <JobStatusChip status="connected" size="sm" />
            </Box>
          ))}
        </Box>
      </Box>

      <BottomNavigation value={activeTab} onChange={(_, v) => setActiveTab(v)}
        sx={{ borderTop: '1px solid #E8ECF4', flexShrink: 0 }}>
        <BottomNavigationAction label="Overview" icon={<DashboardIcon />} />
        <BottomNavigationAction label="Reports" icon={<DescriptionIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Box>
  );
}
