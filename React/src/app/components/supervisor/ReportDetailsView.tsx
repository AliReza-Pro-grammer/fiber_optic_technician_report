import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useSupervisorViewModel } from '../../../presentation/viewmodels/use_supervisor_vm';
import { useAppContext } from '../../../presentation/app_context';
import { JobStatusChip, ReportStatusChip, WorkflowStepper } from '../shared/StatusChip';

interface FieldRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}
function FieldRow({ label, value, highlight = false }: FieldRowProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Typography sx={{ fontSize: '0.68rem', color: '#90A4AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: '0.88rem',
        color: highlight ? '#0A2463' : '#1A1A2E',
        fontWeight: highlight ? 700 : 500,
      }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

export function ReportDetailsView() {
  const { navState } = useAppContext();
  const vm = useSupervisorViewModel();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const jobId = navState.params?.jobId ?? '';
  const reportType = navState.params?.reportType ?? 'cable';
  const job = vm.jobs.find(j => j.id === jobId);
  const cableReport = vm.getCableReport(jobId);
  const fusionReport = vm.getFusionReport(jobId);
  const report = reportType === 'cable' ? cableReport : fusionReport;
  const tech = report ? vm.getUserById(report.submittedById) : null;

  if (!job) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#90A4AE' }}>Job not found</Typography>
      </Box>
    );
  }

  const handleApprove = () => {
    vm.approveReport(jobId, reportType);
    vm.goBack();
  };

  const handleReject = () => {
    if (!rejectNote) return;
    vm.rejectReport(jobId, reportType, rejectNote);
    setRejectOpen(false);
    setRejectNote('');
    vm.goBack();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8' }}>
      <AppBar position="static" sx={{ bgcolor: '#0A2463' }}>
        <Toolbar sx={{ minHeight: '52px !important', px: 1.5 }}>
          <IconButton onClick={vm.goBack} sx={{ color: 'white', mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
              {job.clientName}
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
              {job.virtualNumber} · {reportType === 'cable' ? 'Cable' : 'Fusion'} Report
            </Typography>
          </Box>
          {report && <ReportStatusChip status={report.status} />}
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {/* Workflow progress */}
        <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '14px', mb: 2, boxShadow: '0 2px 10px rgba(10,36,99,0.07)' }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#90A4AE', fontWeight: 600, mb: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Job Progress
          </Typography>
          <WorkflowStepper currentStatus={job.status} />
        </Box>

        {/* Job info */}
        <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '14px', mb: 2, boxShadow: '0 2px 10px rgba(10,36,99,0.07)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '10px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E' }}>
              Job Information
            </Typography>
            <JobStatusChip status={job.status} size="sm" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <FieldRow label="Virtual Number" value={job.virtualNumber} highlight />
              <FieldRow label="Provider" value={job.provider} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <LocationOnIcon sx={{ fontSize: 14, color: '#78909C', mt: '2px', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.82rem', color: '#546E7A' }}>{job.address}</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <FieldRow label="Phone" value={job.phone} />
            </Box>
            {job.notes && <FieldRow label="Notes" value={job.notes} />}
          </Box>
        </Box>

        {/* Report details */}
        {report ? (
          <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '14px', mb: 2, boxShadow: '0 2px 10px rgba(10,36,99,0.07)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '12px' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E' }}>
                {reportType === 'cable' ? 'Cable' : 'Fusion'} Report — Material Usage
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '12px', p: '10px', bgcolor: '#F5F7FA', borderRadius: '10px' }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#E8EDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: '#0A2463' }}>
                {tech?.initials}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#1A1A2E' }}>{tech?.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarTodayIcon sx={{ fontSize: 10, color: '#90A4AE' }} />
                  <Typography sx={{ fontSize: '0.68rem', color: '#90A4AE' }}>
                    {new Date(report.submittedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {reportType === 'cable' && cableReport && (
              <Box sx={{ mb: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '10px' }}>
                  <InventoryIcon sx={{ fontSize: 16, color: '#E64A19' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#E64A19', fontWeight: 600, textTransform: 'uppercase' }}>
                    Cable Materials Used
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FieldRow label="Double-braced Cable" value={`${cableReport.doubleBracedCableLength || '—'} m`} highlight />
                  <FieldRow label="Three-braced Cable" value={`${cableReport.threeBracedCableLength || '—'} m`} highlight />
                  <FieldRow label="Cable Clamps" value={cableReport.cableClampCount || '—'} highlight />
                  <FieldRow label="Total Cable Length" value={`${Number(cableReport.doubleBracedCableLength || 0) + Number(cableReport.threeBracedCableLength || 0)} m`} />
                </Box>
              </Box>
            )}

            {reportType === 'fusion' && fusionReport && (
              <Box sx={{ mb: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '10px' }}>
                  <InventoryIcon sx={{ fontSize: 16, color: '#BF360C' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#BF360C', fontWeight: 600, textTransform: 'uppercase' }}>
                    Fusion Materials Used
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FieldRow label="ATB (Access Terminal Box)" value={fusionReport.atbCount || '—'} highlight />
                  <FieldRow label="Pigtails" value={fusionReport.pigtailCount || '—'} highlight />
                  <FieldRow label="Adaptors" value={fusionReport.adaptorCount || '—'} highlight />
                  <FieldRow label="Double-Adaptors" value={fusionReport.doubleAdaptorCount || '—'} highlight />
                  <FieldRow label="TB*8 (8-port Box)" value={fusionReport.tb8Count || '—'} highlight />
                  <FieldRow label="TB*4 (4-port Box)" value={fusionReport.tb4Count || '—'} highlight />
                  <FieldRow label="Splitters" value={fusionReport.splitterCount || '—'} highlight />
                  <FieldRow label="Cable Clamps" value={fusionReport.cableClampCount || '—'} highlight />
                </Box>
              </Box>
            )}

            {report.details && (
              <Box sx={{ bgcolor: '#F5F7FA', borderRadius: '10px', p: '10px' }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#90A4AE', fontWeight: 600, mb: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Additional Notes
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#546E7A', lineHeight: 1.5 }}>
                  {report.details}
                </Typography>
              </Box>
            )}

            {report.reviewNote && (
              <Box sx={{ mt: '10px', bgcolor: '#FFEBEE', borderRadius: '10px', p: '10px', border: '1px solid #FFCDD2' }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#B71C1C', fontWeight: 600, mb: '2px' }}>Rejection Note</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#C62828' }}>{report.reviewNote}</Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '20px', textAlign: 'center', mb: 2 }}>
            <Typography sx={{ color: '#90A4AE', fontSize: '0.85rem' }}>
              No {reportType} report submitted yet
            </Typography>
          </Box>
        )}

        {/* Actions */}
        {report && report.status === 'pending' && (
          <Box sx={{ display: 'flex', gap: '10px', mb: 1 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<CancelIcon />}
              onClick={() => setRejectOpen(true)}
              sx={{
                flex: 1, borderRadius: '12px', py: '12px',
                bgcolor: '#FFEBEE', color: '#B71C1C', fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#FFCDD2' },
              }}
            >
              Reject
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={handleApprove}
              sx={{
                flex: 1, borderRadius: '12px', py: '12px',
                bgcolor: '#1B5E20', color: 'white', fontWeight: 600,
                boxShadow: '0 4px 16px rgba(27,94,32,0.3)',
                '&:hover': { bgcolor: '#2E7D32' },
              }}
            >
              Approve
            </Button>
          </Box>
        )}
      </Box>

      {/* Reject dialog */}
      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        PaperProps={{ sx: { mx: 2, borderRadius: '20px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '0.95rem', pb: 1 }}>Reject Report</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectNote}
            onChange={e => setRejectNote(e.target.value)}
            placeholder="Explain why this report is being rejected..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: '8px' }}>
          <Button onClick={() => setRejectOpen(false)} sx={{ color: '#546E7A' }}>Cancel</Button>
          <Button
            onClick={handleReject}
            disabled={!rejectNote}
            variant="contained"
            sx={{ bgcolor: '#B71C1C', borderRadius: '10px', '&:hover': { bgcolor: '#C62828' } }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
