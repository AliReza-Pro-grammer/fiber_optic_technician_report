import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CableIcon from '@mui/icons-material/Cable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useCableTechViewModel } from '../../../presentation/viewmodels/use_tech_vm';
import { useAppContext } from '../../../presentation/app_context';
import { toast } from 'sonner';

export function CableReportForm() {
  const { navState, jobs } = useAppContext();
  const vm = useCableTechViewModel();
  const jobId = navState.params?.jobId ?? '';
  const [submitted, setSubmitted] = useState(false);

  // Get job info - technician cannot edit client info, only view
  const job = useMemo(() => jobs.find(j => j.id === jobId), [jobs, jobId]);

  const [form, setForm] = useState({
    doubleBracedCableLength: '',
    threeBracedCableLength: '',
    cableClampCount: '',
    details: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const canSubmit = form.doubleBracedCableLength.trim() && form.threeBracedCableLength.trim() && form.cableClampCount.trim();

  const handleSubmit = () => {
    if (!vm.currentUser || !job) return;
    vm.submitCableReport({
      jobId,
      submittedById: vm.currentUser.id,
      clientName: job.clientName,
      address: job.address,
      doubleBracedCableLength: form.doubleBracedCableLength,
      threeBracedCableLength: form.threeBracedCableLength,
      cableClampCount: form.cableClampCount,
      // Legacy fields for backward compatibility
      cableLength: String(Number(form.doubleBracedCableLength) + Number(form.threeBracedCableLength)),
      cableType: 'Single Mode',
      details: form.details,
    });
    setSubmitted(true);
    toast.success('Cable report submitted for review!');
  };

  if (submitted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: '#2E7D32' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1A2E', mb: 1, textAlign: 'center' }}>
          Report Submitted!
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#78909C', textAlign: 'center', mb: 3 }}>
          Your cable report is pending supervisor review.
        </Typography>
        <Button
          variant="contained"
          onClick={vm.goBack}
          sx={{ borderRadius: '12px', px: 4, py: '12px', bgcolor: '#0A2463' }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Typography sx={{ color: '#90A4AE' }}>Job not found</Typography>
        <Button onClick={vm.goBack} sx={{ mt: 2 }}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8' }}>
      <AppBar position="static" sx={{ bgcolor: '#0A2463' }}>
        <Toolbar sx={{ minHeight: '52px !important', px: 1.5 }}>
          <IconButton onClick={vm.goBack} sx={{ color: 'white', mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
              Cable Report
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
              {job.virtualNumber} · {job.clientName}
            </Typography>
          </Box>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#E64A19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CableIcon sx={{ fontSize: 18, color: 'white' }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {/* Client Info - READ ONLY (set by supervisor) */}
        <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '16px', mb: 2, boxShadow: '0 2px 8px rgba(10,36,99,0.07)', border: '1px solid #E8EDF9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '10px' }}>
            <VisibilityIcon sx={{ fontSize: 16, color: '#78909C' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#546E7A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Client Information (Read-Only)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Box>
              <Typography sx={{ fontSize: '0.68rem', color: '#90A4AE', fontWeight: 600 }}>Virtual Number</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#1A1A2E', fontWeight: 600 }}>{job.virtualNumber}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.68rem', color: '#90A4AE', fontWeight: 600 }}>Client Name</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#1A1A2E' }}>{job.clientName}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.68rem', color: '#90A4AE', fontWeight: 600 }}>Address</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#546E7A' }}>{job.address}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Material Usage - Technician fills this */}
        <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '16px', boxShadow: '0 2px 8px rgba(10,36,99,0.07)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '14px' }}>
            <EditIcon sx={{ fontSize: 16, color: '#E64A19' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E' }}>
              Material Usage
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.72rem', color: '#90A4AE', mb: '14px' }}>
            Enter the quantities of materials used for this installation
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <TextField
              label="Length of Double-braced Cable Used (meters)"
              value={form.doubleBracedCableLength}
              onChange={handleChange('doubleBracedCableLength')}
              fullWidth
              required
              type="number"
              placeholder="e.g. 280"
              InputProps={{ inputProps: { min: 0 } }}
              helperText="Total length of double-armored cable installed"
            />
            <TextField
              label="Length of Three-braced Cable Used (meters)"
              value={form.threeBracedCableLength}
              onChange={handleChange('threeBracedCableLength')}
              fullWidth
              required
              type="number"
              placeholder="e.g. 170"
              InputProps={{ inputProps: { min: 0 } }}
              helperText="Total length of triple-armored cable installed"
            />
            <TextField
              label="Number of Cable Clamps Used"
              value={form.cableClampCount}
              onChange={handleChange('cableClampCount')}
              fullWidth
              required
              type="number"
              placeholder="e.g. 12"
              InputProps={{ inputProps: { min: 0 } }}
              helperText="Total cable clamps installed for cable securing"
            />
            <TextField
              label="Additional Notes"
              value={form.details}
              onChange={handleChange('details')}
              fullWidth
              multiline
              rows={3}
              placeholder="Describe any special conditions, issues, or observations..."
            />
          </Box>
        </Box>

        {/* Summary */}
        {(form.doubleBracedCableLength || form.threeBracedCableLength) && (
          <Box sx={{ bgcolor: '#E8EDF9', borderRadius: '12px', p: '14px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#546E7A' }}>Total Cable Length</Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#0A2463' }}>
              {(Number(form.doubleBracedCableLength) || 0) + (Number(form.threeBracedCableLength) || 0)} m
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation buttons */}
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #E8ECF4' }}>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          variant="contained"
          fullWidth
          startIcon={<CheckCircleIcon />}
          sx={{
            borderRadius: '12px', py: '14px',
            bgcolor: '#1B5E20', fontWeight: 600,
            boxShadow: '0 4px 16px rgba(27,94,32,0.3)',
            '&:hover': { bgcolor: '#2E7D32' },
            '&:disabled': { bgcolor: '#CFD8DC', color: '#90A4AE' },
          }}
        >
          Submit Cable Report
        </Button>
      </Box>
    </Box>
  );
}
