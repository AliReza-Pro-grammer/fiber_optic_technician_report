import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlareIcon from '@mui/icons-material/Flare';
import { useFusionTechViewModel } from '../../../presentation/viewmodels/use_tech_vm';
import { useAppContext } from '../../../presentation/app_context';
import { toast } from 'sonner';

export function FusionReportForm() {
  const { navState } = useAppContext();
  const vm = useFusionTechViewModel();
  const jobId = navState.params?.jobId ?? '';
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    clientName: '',
    address: '',
    pigtails: '',
    adaptors: '',
    atb: '',
    tb: '',
    details: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const canProceedStep0 = form.clientName.trim() && form.address.trim();
  const canProceedStep1 = form.pigtails.trim() && form.adaptors.trim() && form.atb.trim() && form.tb.trim();

  const handleSubmit = () => {
    if (!vm.currentUser) return;
    vm.submitFusionReport({
      jobId,
      submittedById: vm.currentUser.id,
      clientName: form.clientName,
      address: form.address,
      pigtails: form.pigtails,
      adaptors: form.adaptors,
      atb: form.atb,
      tb: form.tb,
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
              Job #{jobId}
            </Typography>
          </Box>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#BF360C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlareIcon sx={{ fontSize: 18, color: 'white' }} />
          </Box>
        </Toolbar>
      </AppBar>

      <LinearProgress
        variant="determinate"
        value={(step / 1) * 100}
        sx={{ height: 3, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#BF360C' } }}
      />

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '12px 14px', mb: 2, boxShadow: '0 2px 8px rgba(10,36,99,0.07)' }}>
          <Stepper activeStep={step} alternativeLabel>
            <Step key="step-client">
              <StepLabel sx={{
                '& .MuiStepLabel-label': { fontSize: '0.7rem' },
                '& .MuiStepIcon-root.Mui-active': { color: '#BF360C' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#2E7D32' },
              }}>
                Client Info
              </StepLabel>
            </Step>
            <Step key="step-splice">
              <StepLabel sx={{
                '& .MuiStepLabel-label': { fontSize: '0.7rem' },
                '& .MuiStepIcon-root.Mui-active': { color: '#BF360C' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#2E7D32' },
              }}>
                Splice Details
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
                fullWidth required
                placeholder="Enter client name"
              />
              <TextField
                label="Address"
                value={form.address}
                onChange={handleChange('address')}
                fullWidth required multiline rows={3}
                placeholder="Full installation address"
              />
            </Box>
          </Box>
        )}

        {step === 1 && (
          <Box sx={{ bgcolor: 'white', borderRadius: '14px', p: '16px', boxShadow: '0 2px 8px rgba(10,36,99,0.07)' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E', mb: '14px' }}>
              Splicing Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <TextField
                  label="Pigtails"
                  value={form.pigtails}
                  onChange={handleChange('pigtails')}
                  required type="number"
                  placeholder="e.g. 8"
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  label="Adaptors"
                  value={form.adaptors}
                  onChange={handleChange('adaptors')}
                  required type="number"
                  placeholder="e.g. 4"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <TextField
                  label="ATB"
                  value={form.atb}
                  onChange={handleChange('atb')}
                  required
                  placeholder="e.g. ATB-24"
                />
                <TextField
                  label="TB"
                  value={form.tb}
                  onChange={handleChange('tb')}
                  required
                  placeholder="e.g. TB-1"
                />
              </Box>
              <TextField
                label="Details & Notes"
                value={form.details}
                onChange={handleChange('details')}
                fullWidth multiline rows={4}
                placeholder="Describe splice quality, OTDR readings, enclosure type, special conditions..."
              />
            </Box>
          </Box>
        )}
      </Box>

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
              bgcolor: '#BF360C', fontWeight: 600,
              boxShadow: '0 4px 16px rgba(191,54,12,0.3)',
              '&:hover': { bgcolor: '#7B1700' },
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
