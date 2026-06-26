import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Fab from '@mui/material/Fab';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import CloseIcon from '@mui/icons-material/Close';
import { useSupervisorViewModel } from '../../../presentation/viewmodels/use_supervisor_vm';
import { NotificationService } from '../../../data/notification_service';
import { toast } from 'sonner';
import { JobCard, SectionHeader } from '../shared/JobCard';
import { JobStatusChip } from '../shared/StatusChip';
import { AddJobModal } from './AddJobModal';
import { JobStatus } from '../../../domain/entities';
import { STATUS_CONFIG } from '../../theme';

const FILTER_TABS: { label: string; value: JobStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Cable', value: 'cable' },
  { label: 'Fusion', value: 'fusion' },
  { label: 'Connected', value: 'connected' },
];

export function SupervisorDashboard() {
  const vm = useSupervisorViewModel();
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all');
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(() => NotificationService.getPermission());
  const [notifBannerDismissed, setNotifBannerDismissed] = useState(false);

  const handleEnableNotifications = useCallback(async () => {
    const result = await NotificationService.requestPermission();
    setNotifPerm(result);
    if (result === 'granted') {
      toast.success('Push notifications enabled');
      NotificationService.send('FiberOps', 'Notifications are now active for your supervisor account.');
    } else {
      toast.error('Notification permission denied by browser');
    }
  }, []);

  // Simulate a push notification arriving after 10 s (remote tech submitting from another device)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (NotificationService.getPermission() === 'granted') {
        NotificationService.send(
          'FiberOps — New Cable Report',
          'Omar Khalid submitted a cable report for Hassan Al-Mutairi (#J003)',
          'sim-push-j003',
        );
      }
      toast('New cable report received', {
        description: 'Omar Khalid · Job #J003 · Hassan Al-Mutairi',
        action: { label: 'View', onClick: () => vm.navigate('supervisor_reports') },
        duration: 6000,
      });
    }, 10000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredJobs = filterStatus === 'all' ? vm.jobs : vm.filterJobs(filterStatus);

  const statCards = [
    { label: 'New', count: vm.jobStats.new, cfg: STATUS_CONFIG.new },
    { label: 'Cable', count: vm.jobStats.cable, cfg: STATUS_CONFIG.cable },
    { label: 'Fusion', count: vm.jobStats.fusion, cfg: STATUS_CONFIG.fusion },
    { label: 'Done', count: vm.jobStats.connected, cfg: STATUS_CONFIG.connected },
  ];

  if (activeTab === 1) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8' }}>
        <AppBar position="static" sx={{ bgcolor: '#0A2463' }}>
          <Toolbar sx={{ minHeight: '52px !important', px: 2 }}>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, fontSize: '1rem' }}>
              Report Center
            </Typography>
            <IconButton onClick={vm.logout} sx={{ color: 'rgba(255,255,255,0.7)', p: '8px' }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <SectionHeader
            title="Pending Review"
            count={vm.pendingReports.length}
            color="#E65100"
          />
          {vm.pendingReports.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: '#90A4AE', fontSize: '0.85rem' }}>No pending reports</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
              {vm.pendingReports.map(r => {
                const job = vm.jobs.find(j => j.id === r.jobId);
                return (
                  <Box
                    key={r.id}
                    onClick={() => vm.navigate('supervisor_report_detail', { jobId: r.jobId, reportType: r.reportType })}
                    sx={{
                      bgcolor: 'white', borderRadius: '14px', p: '14px',
                      cursor: 'pointer', boxShadow: '0 2px 10px rgba(10,36,99,0.07)',
                      border: '1px solid #FFF3E0',
                      '&:hover': { boxShadow: '0 4px 16px rgba(10,36,99,0.12)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '6px' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1A1A2E' }}>
                        {r.clientName}
                      </Typography>
                      <Box sx={{
                        bgcolor: '#FFF3E0', color: '#E65100', px: '8px', py: '2px',
                        borderRadius: '99px', fontSize: '0.68rem', fontWeight: 700,
                      }}>
                        {r.reportType.toUpperCase()} REPORT
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#78909C', mb: '6px' }}>
                      {r.address}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#B0BEC5' }}>
                        {new Date(r.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      {job && <JobStatusChip status={job.status} size="sm" />}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          <SectionHeader title="All Reports" count={vm.allReports.length} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {vm.allReports.slice(0, 8).map(r => {
              const job = vm.jobs.find(j => j.id === r.jobId);
              return (
                <Box
                  key={r.id}
                  onClick={() => vm.navigate('supervisor_report_detail', { jobId: r.jobId, reportType: r.reportType })}
                  sx={{
                    bgcolor: 'white', borderRadius: '12px', p: '12px',
                    cursor: 'pointer', boxShadow: '0 1px 6px rgba(10,36,99,0.06)',
                    '&:hover': { boxShadow: '0 3px 12px rgba(10,36,99,0.10)' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#1A1A2E' }}>
                        {r.clientName}
                      </Typography>
                      <Typography sx={{ fontSize: '0.68rem', color: '#90A4AE' }}>
                        {r.reportType === 'cable' ? 'Cable Report' : 'Fusion Report'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <Box sx={{
                        bgcolor: r.status === 'approved' ? '#E8F5E9' : r.status === 'rejected' ? '#FFEBEE' : '#FFF8E1',
                        color: r.status === 'approved' ? '#1B5E20' : r.status === 'rejected' ? '#B71C1C' : '#F57F17',
                        px: '7px', py: '2px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700,
                      }}>
                        {r.status.toUpperCase()}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        <BottomNavigation value={activeTab} onChange={(_, v) => setActiveTab(v)}
          sx={{ borderTop: '1px solid #E8ECF4', flexShrink: 0 }}>
          <BottomNavigationAction label="Jobs" icon={<WorkIcon />} />
          <BottomNavigationAction label="Reports" icon={<Badge badgeContent={vm.pendingReports.length} color="error"><DescriptionIcon /></Badge>} />
        </BottomNavigation>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8', position: 'relative' }}>
      <AppBar position="static" sx={{ bgcolor: '#0A2463' }}>
        <Toolbar sx={{ minHeight: '52px !important', px: 2 }}>
          <WifiTetheringIcon sx={{ color: '#3E92CC', mr: 1, fontSize: 22 }} />
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
            FiberOps
          </Typography>
          <IconButton onClick={() => { setActiveTab(1); }} sx={{ color: 'rgba(255,255,255,0.85)' }}>
            <Badge badgeContent={vm.pendingReports.length} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton onClick={vm.logout} sx={{ color: 'rgba(255,255,255,0.7)', p: '8px' }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Notification permission banner */}
      {notifPerm === 'default' && !notifBannerDismissed && (
        <Box sx={{
          bgcolor: '#E8EDF9', px: 2, py: '10px',
          display: 'flex', alignItems: 'center', gap: '10px',
          borderBottom: '1px solid #C5CEE8',
        }}>
          <NotificationsActiveIcon sx={{ color: '#0A2463', fontSize: 18, flexShrink: 0 }} />
          <Typography sx={{ flex: 1, fontSize: '0.74rem', color: '#1A1A2E', lineHeight: 1.4 }}>
            Enable push notifications to receive report alerts
          </Typography>
          <Box
            onClick={handleEnableNotifications}
            sx={{
              bgcolor: '#0A2463', color: 'white', px: '10px', py: '4px',
              borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700,
              cursor: 'pointer', flexShrink: 0,
              '&:active': { opacity: 0.8 },
            }}
          >
            Enable
          </Box>
          <IconButton size="small" onClick={() => setNotifBannerDismissed(true)} sx={{ color: '#78909C', p: '2px' }}>
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      )}
      {notifPerm === 'denied' && !notifBannerDismissed && (
        <Box sx={{
          bgcolor: '#FFF3E0', px: 2, py: '8px',
          display: 'flex', alignItems: 'center', gap: '8px',
          borderBottom: '1px solid #FFE0B2',
        }}>
          <NotificationsOffIcon sx={{ color: '#E65100', fontSize: 16, flexShrink: 0 }} />
          <Typography sx={{ flex: 1, fontSize: '0.72rem', color: '#BF360C' }}>
            Push notifications blocked. Enable them in browser settings.
          </Typography>
          <IconButton size="small" onClick={() => setNotifBannerDismissed(true)} sx={{ color: '#E65100', p: '2px' }}>
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      )}

      <Box sx={{ flex: 1, overflowY: 'auto', pb: '80px' }}>
        {/* Stat cards */}
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
            {statCards.map(s => (
              <Box key={s.label} sx={{
                bgcolor: 'white', borderRadius: '12px', p: '10px 8px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(10,36,99,0.06)',
                border: `1px solid ${s.cfg.bg}`,
              }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: s.cfg.dot, lineHeight: 1 }}>
                  {s.count}
                </Typography>
                <Typography sx={{ fontSize: '0.62rem', color: '#78909C', mt: '2px', fontWeight: 500 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Filter tabs */}
        <Box sx={{ px: 2, mb: 1.5 }}>
          <Box sx={{ display: 'flex', gap: '6px', overflowX: 'auto', pb: '4px', '&::-webkit-scrollbar': { display: 'none' } }}>
            {FILTER_TABS.map(tab => {
              const isActive = filterStatus === tab.value;
              const cfg = tab.value !== 'all' ? STATUS_CONFIG[tab.value] : null;
              return (
                <Box
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  sx={{
                    px: '14px', py: '6px',
                    borderRadius: '99px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    bgcolor: isActive ? (cfg?.dot ?? '#0A2463') : 'white',
                    color: isActive ? 'white' : '#546E7A',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    border: `1px solid ${isActive ? (cfg?.dot ?? '#0A2463') : '#E8ECF4'}`,
                    transition: 'all 0.18s',
                    boxShadow: isActive ? `0 3px 10px ${cfg?.dot ?? '#0A2463'}40` : 'none',
                  }}
                >
                  {tab.label}
                  {tab.value !== 'all' && (
                    <span style={{ marginLeft: 4, opacity: 0.7 }}>
                      ({vm.jobStats[tab.value as JobStatus] ?? 0})
                    </span>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Job list */}
        <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => vm.navigate('supervisor_report_detail', {
                jobId: job.id,
                reportType: job.status === 'fusion' || job.status === 'connected' ? 'fusion' : 'cable',
              })}
            />
          ))}
          {filteredJobs.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography sx={{ color: '#90A4AE', fontSize: '0.85rem' }}>No jobs found</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* FAB */}
      <Fab
        size="medium"
        onClick={() => setAddJobOpen(true)}
        sx={{
          position: 'absolute', right: 20, bottom: 76,
          bgcolor: '#3E92CC', color: 'white',
          '&:hover': { bgcolor: '#2A7AB8' },
          zIndex: 10,
        }}
      >
        <AddIcon />
      </Fab>

      <BottomNavigation value={activeTab} onChange={(_, v) => setActiveTab(v)}
        sx={{ borderTop: '1px solid #E8ECF4', flexShrink: 0 }}>
        <BottomNavigationAction label="Jobs" icon={<WorkIcon />} />
        <BottomNavigationAction
          label="Reports"
          icon={<Badge badgeContent={vm.pendingReports.length} color="error"><DescriptionIcon /></Badge>}
        />
      </BottomNavigation>

      <AddJobModal
        open={addJobOpen}
        onClose={() => setAddJobOpen(false)}
        onSubmit={(data) => { vm.addJob(data); setAddJobOpen(false); }}
      />
    </Box>
  );
}
