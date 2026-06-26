import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CableIcon from '@mui/icons-material/Cable';
import { useCableTechViewModel } from '../../../presentation/viewmodels/use_tech_vm';
import { useAppContext } from '../../../presentation/app_context';
import { toast } from 'sonner';

const CABLE_TYPES = [
  'Single Mode G.652D',
  'Single Mode G.657A',
  'Multi Mode OM3',
  'Multi Mode OM4',
  'Armored Single Mode',
];

export function CableReportForm() {
  const { navState } = useAppContext();
  const vm = useCableTechViewModel();
  const jobId = navState.params?.jobId ?? '';
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    clientName: '',
    address: '',
    cableLength: '',
    cableType: 'Single Mode G.652D',
    details: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const canProceedStep0 = form.clientName.trim() && form.address.trim();
  const canProceedStep1 = form.cableLength.trim() && form.cableType.trim();

  const handleSubmit = () => {
    if (!vm.currentUser) return;
    vm.submitCableReport({
      jobId,
      submittedById: vm.currentUser.id,
      clientName: form.clientName,
      address: form.address,
      cableLength: form.cableLength,
      cableType: form.cableType,
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
              Job #{jobId}
            </Typography>
          </Box>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#E64A19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CableIcon sx={{ fontSize: 18, color: 'white' }} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Progress */}
      <LinearProgress
        variant="determinate"
        value={(step / 1) * 100}
        sx={{ height: 3, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#E64A19' } }}
      />

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {/* Step indicator */}
        <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '12px 14px', mb: 2, boxShadow: '0 2px 8px rgba(10,36,99,0.07)' }}>
          <Stepper activeStep={step} alternativeLabel>
            <Step key="step-client">
              <StepLabel sx={{
                '& .MuiStepLabel-label': { fontSize: '0.7rem' },
                '& .MuiStepIcon-root.Mui-active': { color: '#E64A19' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#2E7D32' },
              }}>
                Client Info
              </StepLabel>
            </Step>
            <Step key="step-cable">
              <StepLabel sx={{
                '& .MuiStepLabel-label': { fontSize: '0.7rem' },
                '& .MuiStepIcon-root.Mui-active': { color: '#E64A19' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#2E7D32' },
              }}>
                Cable Details
              </StepLabel>
            </Step>
          </Stepper>
        </Box>

        {step === 0 && (
          <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '16px', boxShadow: '0 2px 8px rgba(10,36,99,0.07)' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E', mb: '14px' }}>
              Client Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <TextField
                label="Client Name"
                value={form.clientName}
                onChange={handleChange('clientName')}
                fullWidth
                required
                placeholder="Enter client name"
              />
              <TextField
                label="Address"
                value={form.address}
                onChange={handleChange('address')}
                fullWidth
                required
                multiline
                rows={3}
                placeholder="Full installation address"
              />
            </Box>
          </Box>
        )}

        {step === 1 && (
          <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '16px', boxShadow: '0 2px 8px rgba(10,36,99,0.07)' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E', mb: '14px' }}>
              Cable Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <TextField
                label="Cable Length (meters)"
                value={form.cableLength}
                onChange={handleChange('cableLength')}
                fullWidth
                required
                type="number"
                placeholder="e.g. 450"
                InputProps={{ inputProps: { min: 0 } }}
              />
              <TextField
                label="Cable Type"
                value={form.cableType}
                onChange={handleChange('cableType')}
                fullWidth
                select
                required
              >
                {CABLE_TYPES.map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Details & Notes"
                value={form.details}
                onChange={handleChange('details')}
                fullWidth
                multiline
                rows={4}
                placeholder="Describe the installation: route taken, conduit used, any issues encountered..."
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation buttons */}
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #E8ECF4', display: 'flex', gap: '10px' }}>
        {step > 0 && (
          <Button
            onClick={() => setStep(s => s - 1)}
            sx={{
              flex: 1, borderRadius: '12px', py: '12px',
              color: '#546E7A', bgcolor: '#EEF1F8', fontWeight: 600,
              '&:hover': { bgcolor: '#E0E5EF' },
            }}
          >
            Back
          </Button>
        )}
        {step < 1 ? (
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceedStep0}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              flex: 1, borderRadius: '12px', py: '12px',
              bgcolor: '#E64A19', fontWeight: 600,
              boxShadow: '0 4px 16px rgba(230,74,25,0.3)',
              '&:hover': { bgcolor: '#BF360C' },
              '&:disabled': { bgcolor: '#CFD8DC', color: '#90A4AE' },
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceedStep1}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              flex: 1, borderRadius: '12px', py: '12px',
              bgcolor: '#1B5E20', fontWeight: 600,
              boxShadow: '0 4px 16px rgba(27,94,32,0.3)',
              '&:hover': { bgcolor: '#2E7D32' },
              '&:disabled': { bgcolor: '#CFD8DC', color: '#90A4AE' },
            }}
          >
            Submit Report
          </Button>
        )}
      </Box>
    </Box>
  );
}
