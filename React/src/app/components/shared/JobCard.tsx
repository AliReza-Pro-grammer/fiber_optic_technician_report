import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Job } from '../../../domain/entities';
import { JobStatusChip } from './StatusChip';
import { STATUS_CONFIG } from '../../theme';

interface JobCardProps {
  job: Job;
  onPress?: () => void;
  actions?: React.ReactNode;
  compact?: boolean;
}

export function JobCard({ job, onPress, actions, compact = false }: JobCardProps) {
  const cfg = STATUS_CONFIG[job.status];
  const dateStr = new Date(job.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <Box
      onClick={onPress}
      sx={{
        bgcolor: 'white',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        cursor: onPress ? 'pointer' : 'default',
        boxShadow: '0 2px 10px rgba(10,36,99,0.07)',
        transition: 'box-shadow 0.2s, transform 0.15s',
        '&:active': onPress ? { transform: 'scale(0.98)', boxShadow: '0 1px 6px rgba(10,36,99,0.1)' } : {},
        '&:hover': onPress ? { boxShadow: '0 4px 16px rgba(10,36,99,0.12)' } : {},
      }}
    >
      {/* Status bar stripe */}
      <Box sx={{ width: 4, bgcolor: cfg.bar, flexShrink: 0 }} />

      <Box sx={{ flex: 1, p: compact ? '10px 12px' : '12px 14px' }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '6px' }}>
          <Box sx={{ flex: 1, mr: 1 }}>
            <Typography sx={{
              fontWeight: 700, fontSize: compact ? '0.85rem' : '0.92rem',
              color: '#1A1A2E', lineHeight: 1.2,
            }}>
              {job.clientName}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#90A4AE', fontWeight: 500, mt: '2px' }}>
              #{job.id}
            </Typography>
          </Box>
          <JobStatusChip status={job.status} size={compact ? 'sm' : 'md'} />
        </Box>

        {!compact && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: '4px' }}>
              <LocationOnIcon sx={{ fontSize: 12, color: '#78909C' }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#546E7A', lineHeight: 1.3 }}>
                {job.address}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BusinessIcon sx={{ fontSize: 11, color: '#90A4AE' }} />
                  <Typography sx={{ fontSize: '0.7rem', color: '#90A4AE' }}>{job.provider}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarTodayIcon sx={{ fontSize: 11, color: '#90A4AE' }} />
                  <Typography sx={{ fontSize: '0.7rem', color: '#90A4AE' }}>{dateStr}</Typography>
                </Box>
              </Box>
              {onPress && !actions && (
                <ChevronRightIcon sx={{ fontSize: 18, color: '#B0BEC5' }} />
              )}
            </Box>
          </>
        )}

        {/* Actions */}
        {actions && (
          <Box sx={{ mt: '10px', display: 'flex', gap: '8px' }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}

interface SectionHeaderProps {
  title: string;
  count?: number;
  color?: string;
}

export function SectionHeader({ title, count, color = '#0A2463' }: SectionHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '10px', mt: '4px' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </Typography>
      {count !== undefined && (
        <Box sx={{
          bgcolor: color, color: 'white',
          width: 20, height: 20, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', fontWeight: 700,
        }}>
          {count}
        </Box>
      )}
      <Box sx={{ flex: 1, height: '1px', bgcolor: '#E8ECF4' }} />
    </Box>
  );
}
