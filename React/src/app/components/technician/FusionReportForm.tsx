import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlareIcon from '@mui/icons-material/Flare';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useFusionTechViewModel } from '../../../presentation/viewmodels/use_tech_vm';
import { useAppContext } from '../../../presentation/app_context';
import { toast } from 'sonner';

export function FusionReportForm() {
  const { navState, jobs } = useAppContext();
  const vm = useFusionTechViewModel();
  const jobId = navState.params?.jobId ?? '';
  const [submitted, setSubmitted] = useState(false);

  // Get job info - technician cannot edit client info, only view
  const job = useMemo(() => jobs.find(j => j.id === jobId), [jobs, jobId]);

  const [form, setForm] = useState({
    atbCount: '',
    pigtailCount: '',
    adaptorCount: '',
    doubleAdaptorCount: '',
    tb8Count: '',
    tb4Count: '',
    splitterCount: '',
    cableClampCount: '',
    details: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const canSubmit = form.atbCount.trim() && form.pigtailCount.trim() && form.adaptorCount.trim()
    && form.doubleAdaptorCount.trim() && form.tb8Count.trim() && form.tb4Count.trim()
    && form.splitterCount.trim() && form.cableClampCount.trim();

  const handleSubmit = () => {
    if (!vm.currentUser || !job) return;
    vm.submitFusionReport({
      jobId,
      submittedById: vm.currentUser.id,
      clientName: job.clientName,
      address: job.address,
      atbCount: form.atbCount,
      pigtailCount: form.pigtailCount,
      adaptorCount: form.adaptorCount,
      doubleAdaptorCount: form.doubleAdaptorCount,
      tb8Count: form.tb8Count,
      tb4Count: form.tb4Count,
      splitterCount: form.splitterCount,
      cableClampCount: form.cableClampCount,
      // Legacy fields for backward compatibility
      pigtails: form.pigtailCount,
      adaptors: form.adaptorCount,
      atb: `ATB-${form.atbCount}`,
      tb: `TB-${form.tb8Count}-${form.tb4Count}`,
      details: form.details,
    });
    setSubmitted(true);
    toast.success('Fusion report submitted for review!');
  };

  if (submitted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#EEF1F8', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: '#2E7D32' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1A2E', mb: 1, textAlign: 'center' }}>
          Fusion Report Submitted!
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#78909C', textAlign: 'center', mb: 3 }}>
          Your fusion splicing report is pending supervisor review.
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
              Fusion Report
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
              {job.virtualNumber} · {job.clientName}
            </Typography>
          </Box>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#BF360C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlareIcon sx={{ fontSize: 18, color: 'white' }} />
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
            <EditIcon sx={{ fontSize: 16, color: '#BF360C' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E' }}>
              Fusion Material Usage
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.72rem', color: '#90A4AE', mb: '14px' }}>
            Enter the quantities of materials used for this fusion splicing job
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Row 1: ATB and Pigtail */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <TextField
                label="Number of ATB Used"
                value={form.atbCount}
                onChange={handleChange('atbCount')}
                required
                type="number"
                placeholder="e.g. 2"
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Access Terminal Box units"
              />
              <TextField
                label="Number of Pigtails Used"
                value={form.pigtailCount}
                onChange={handleChange('pigtailCount')}
                required
                type="number"
                placeholder="e.g. 8"
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Fiber pigtails installed"
              />
            </Box>

            {/* Row 2: Adaptor and Double-Adaptor */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <TextField
                label="Number of Adaptors Used"
                value={form.adaptorCount}
                onChange={handleChange('adaptorCount')}
                required
                type="number"
                placeholder="e.g. 4"
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Single-fiber adaptors"
              />
              <TextField
                label="Number of Double-Adaptors Used"
                value={form.doubleAdaptorCount}
                onChange={handleChange('doubleAdaptorCount')}
                required
                type="number"
                placeholder="e.g. 2"
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Double-fiber adaptors"
              />
            </Box>

            {/* Row 3: TB*8 and TB*4 */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <TextField
                label="Number of TB*8 Used"
                value={form.tb8Count}
                onChange={handleChange('tb8Count')}
                required
                type="number"
                placeholder="e.g. 2"
                InputProps={{ inputProps: { min: 0 } }}
                helperText="8-port termination boxes"
              />
              <TextField
                label="Number of TB*4 Used"
                value={form.tb4Count}
                onChange={handleChange('tb4Count')}
                required
                type="number"
                placeholder="e.g. 1"
                InputProps={{ inputProps: { min: 0 } }}
                helperText="4-port termination boxes"
              />
            </Box>

            {/* Row 4: Splitter and Cable Clamp */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <TextField
                label="Number of Splitters Used"
                value={form.splitterCount}
                onChange={handleChange('splitterCount')}
                required
                type="number"
                placeholder="e.g. 1"
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Fiber splitters installed"
              />
              <TextField
                label="Number of Cable Clamps Used"
                value={form.cableClampCount}
                onChange={handleChange('cableClampCount')}
                required
                type="number"
                placeholder="e.g. 10"
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Cable securing clamps"
              />
            </Box>

            {/* Notes */}
            <TextField
              label="Additional Notes"
              value={form.details}
              onChange={handleChange('details')}
              fullWidth
              multiline
              rows={3}
              placeholder="Describe splice quality, OTDR readings, special conditions..."
              sx={{ mt: '8px' }}
            />
          </Box>
        </Box>
      </Box>

      {/* Submit button */}
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
          Submit Fusion Report
        </Button>
      </Box>
    </Box>
  );
}
