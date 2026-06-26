import React from 'react';
import Box from '@mui/material/Box';
import { JobStatus, ReportStatus } from '../../../domain/entities';
import { STATUS_CONFIG, REPORT_STATUS_CONFIG } from '../../theme';

interface JobStatusChipProps {
  status: JobStatus;
  size?: 'sm' | 'md';
}

export function JobStatusChip({ status, size = 'md' }: JobStatusChipProps) {
  const cfg = STATUS_CONFIG[status];
  const isSmall = size === 'sm';

  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      bgcolor: cfg.bg, color: cfg.color,
      px: isSmall ? '8px' : '10px',
      py: isSmall ? '2px' : '4px',
      borderRadius: '99px',
      fontWeight: 600,
      fontSize: isSmall ? '0.67rem' : '0.72rem',
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      <Box sx={{
        width: isSmall ? 6 : 7, height: isSmall ? 6 : 7,
        borderRadius: '50%',
        bgcolor: cfg.dot,
        flexShrink: 0,
      }} />
      {cfg.label}
    </Box>
  );
}

interface ReportStatusChipProps {
  status: ReportStatus;
}

export function ReportStatusChip({ status }: ReportStatusChipProps) {
  const cfg = REPORT_STATUS_CONFIG[status];
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center',
      bgcolor: cfg.bg, color: cfg.color,
      px: '10px', py: '3px',
      borderRadius: '99px',
      fontWeight: 600,
      fontSize: '0.72rem',
    }}>
      {cfg.label}
    </Box>
  );
}

export function WorkflowStepper({ currentStatus }: { currentStatus: JobStatus }) {
  const steps: JobStatus[] = ['new', 'cable', 'fusion', 'connected'];
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {steps.map((step, i) => {
        const cfg = STATUS_CONFIG[step];
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <React.Fragment key={step}>
            <Box sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              flex: i < steps.length - 1 ? 'none' : undefined,
            }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: '50%',
                bgcolor: isCompleted ? cfg.dot : isCurrent ? cfg.dot : '#E0E0E0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: isCurrent ? `3px solid ${cfg.dot}` : 'none',
                boxShadow: isCurrent ? `0 0 0 3px ${cfg.bg}` : 'none',
                transition: 'all 0.3s',
              }}>
                {isCompleted && (
                  <Box sx={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>✓</Box>
                )}
                {isCurrent && (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
                )}
              </Box>
              <Box sx={{ fontSize: '0.6rem', color: isCurrent ? cfg.dot : '#9E9E9E', fontWeight: isCurrent ? 700 : 400 }}>
                {cfg.label}
              </Box>
            </Box>
            {i < steps.length - 1 && (
              <Box sx={{
                flex: 1, height: 2,
                bgcolor: i < currentIndex ? STATUS_CONFIG[steps[i + 1]].dot : '#E0E0E0',
                mx: '4px',
                mb: '14px',
                transition: 'all 0.3s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}
