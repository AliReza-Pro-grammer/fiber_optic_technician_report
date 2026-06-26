import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCableTechViewModel } from '../../../presentation/viewmodels/use_tech_vm';
import { JobCard, SectionHeader } from '../shared/JobCard';
import { JobStatusChip, ReportStatusChip } from '../shared/StatusChip';
import { Job } from '../../../domain/entities';

function TechStatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <Box sx={{
      flex: 1, bgcolor: 'white', borderRadius: '14px', p: '14px',
      textAlign: 'center', boxShadow: '0 2px 8px rgba(10,36,99,0.07)',
      border: `1px solid ${bg}`,
    }}>
      <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color, lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ fontSize: '0.68rem', color: '#78909C', mt: '3px', fontWeight: 500 }}>{label}</Typography>
    </Box>
  );
}

export function CableTechDashboard() {
  const vm = useCableTechViewModel();

  const getJobActions = (job: Job) => {
    const submitted = vm.hasSubmittedReport(job.id);
    const reportStatus = vm.getReportStatus(job.id);

    if (submitted) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ReportStatusChip status={reportStatus!} />
          <Typography sx={{ fontSize: '0.72rem', color: '#90A4AE' }}>Report submitted</Typography>
        </Box>
      );
    }
    return (
      <Button
        size="small"
        variant="contained"
        endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
        onClick={(e) => { e.stopPropagation(); vm.navigate('cable_report_form', { jobId: job.id }); }}
        sx={{
          fontSize: '0.72rem', borderRadius: '8px', py: '5px', px: '12px',
          bgcolor: '#E64A19', color: 'white', boxShadow: 'none',
          '&:hover': { bgcolor: '#BF360C' },
        }}
      >
        Submit Report
      </Button>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8' }}>
      <AppBar position="static" sx={{ bgcolor: '#0A2463' }}>
        <Toolbar sx={{ minHeight: '52px !important', px: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
              Good day,
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>
              {vm.currentUser?.name}
            </Typography>
          </Box>
          <Box sx={{
            width: 36, height: 36, borderRadius: '50%',
            bgcolor: '#E64A19', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.82rem', color: 'white', mr: 1,
          }}>
            {vm.currentUser?.initials}
          </Box>
          <IconButton onClick={vm.logout} sx={{ color: 'rgba(255,255,255,0.7)', p: '8px' }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Role badge */}
      <Box sx={{
        bgcolor: '#E64A19', px: 2, py: '8px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <PlaylistAddCheckIcon sx={{ color: 'white', fontSize: 16 }} />
        <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
          Cable Technician · {vm.todoJobs.length} job{vm.todoJobs.length !== 1 ? 's' : ''} pending
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {/* Stats */}
        <Box sx={{ display: 'flex', gap: '10px', mb: 2 }}>
          <TechStatCard label="To-Do" value={vm.todoJobs.length} color="#1976D2" bg="#E3F2FD" />
          <TechStatCard label="In Progress" value={vm.inProgressJobs.length} color="#E64A19" bg="#FBE9E7" />
          <TechStatCard label="Forwarded" value={vm.completedJobs.length} color="#1B5E20" bg="#E8F5E9" />
        </Box>

        {/* To-Do jobs */}
        {vm.todoJobs.length > 0 && (
          <>
            <SectionHeader title="To-Do" count={vm.todoJobs.length} color="#1976D2" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
              {vm.todoJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  actions={getJobActions(job)}
                />
              ))}
            </Box>
          </>
        )}

        {/* In Progress jobs */}
        {vm.inProgressJobs.length > 0 && (
          <>
            <SectionHeader title="In Progress" count={vm.inProgressJobs.length} color="#E64A19" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
              {vm.inProgressJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  actions={getJobActions(job)}
                />
              ))}
            </Box>
          </>
        )}

        {/* Completed/forwarded */}
        {vm.completedJobs.length > 0 && (
          <>
            <SectionHeader title="Forwarded to Fusion" count={vm.completedJobs.length} color="#1B5E20" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: 2 }}>
              {vm.completedJobs.map(job => (
                <JobCard key={job.id} job={job} compact />
              ))}
            </Box>
          </>
        )}

        {vm.assignedJobs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: '#B0BEC5', mb: 1 }} />
            <Typography sx={{ color: '#90A4AE', fontSize: '0.88rem' }}>No jobs assigned</Typography>
          </Box>
        )}
      </Box>

      <BottomNavigation sx={{ borderTop: '1px solid #E8ECF4', flexShrink: 0 }}>
        <BottomNavigationAction label="My Jobs" icon={<WorkIcon />} selected />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Box>
  );
}
