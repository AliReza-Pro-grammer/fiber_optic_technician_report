import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Job } from '../../../domain/entities';
import { MOCK_USERS } from '../../../data/mock_data';

const PROVIDERS = ['STC', 'Mobily', 'Etisalat', 'Zain', 'Ooredoo'];

interface AddJobModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddJobModal({ open, onClose, onSubmit }: AddJobModalProps) {
  const [form, setForm] = useState({
    clientName: '',
    address: '',
    phone: '',
    provider: 'STC',
    assignedCableTechId: 'u2',
    assignedFusionTechId: 'u3',
    notes: '',
  });

  const cableTechs = MOCK_USERS.filter(u => u.role === 'cable_tech');
  const fusionTechs = MOCK_USERS.filter(u => u.role === 'fusion_tech');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.clientName || !form.address) return;
    onSubmit({ ...form, status: 'new' });
    setForm({ clientName: '', address: '', phone: '', provider: 'STC', assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: '' });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { mx: 2, borderRadius: '20px', maxHeight: '85vh' } }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              bgcolor: '#E8EDF9', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AddCircleOutlineIcon sx={{ color: '#0A2463', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1A1A2E', lineHeight: 1.2 }}>
                New Job
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#90A4AE' }}>Add a new client job</Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#B0BEC5' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px', pt: 1 }}>
          <TextField
            label="Client Name"
            value={form.clientName}
            onChange={handleChange('clientName')}
            fullWidth
            required
            InputProps={{ sx: { borderRadius: '10px' } }}
          />
          <TextField
            label="Address"
            value={form.address}
            onChange={handleChange('address')}
            fullWidth
            required
            multiline
            rows={2}
            InputProps={{ sx: { borderRadius: '10px' } }}
          />
          <TextField
            label="Phone Number"
            value={form.phone}
            onChange={handleChange('phone')}
            fullWidth
            placeholder="+966 50 000 0000"
            InputProps={{ sx: { borderRadius: '10px' } }}
          />

          <Box sx={{ display: 'flex', gap: '12px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Provider</InputLabel>
              <Select
                value={form.provider}
                label="Provider"
                onChange={e => setForm(prev => ({ ...prev, provider: e.target.value }))}
                sx={{ borderRadius: '10px' }}
              >
                {PROVIDERS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: '12px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Cable Tech</InputLabel>
              <Select
                value={form.assignedCableTechId}
                label="Cable Tech"
                onChange={e => setForm(prev => ({ ...prev, assignedCableTechId: e.target.value }))}
                sx={{ borderRadius: '10px' }}
              >
                {cableTechs.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Fusion Tech</InputLabel>
              <Select
                value={form.assignedFusionTechId}
                label="Fusion Tech"
                onChange={e => setForm(prev => ({ ...prev, assignedFusionTechId: e.target.value }))}
                sx={{ borderRadius: '10px' }}
              >
                {fusionTechs.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Notes"
            value={form.notes}
            onChange={handleChange('notes')}
            fullWidth
            multiline
            rows={2}
            placeholder="Additional notes..."
            InputProps={{ sx: { borderRadius: '10px' } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: '10px' }}>
        <Button
          onClick={onClose}
          sx={{
            flex: 1, borderRadius: '12px', py: '11px',
            color: '#546E7A', bgcolor: '#EEF1F8', fontWeight: 600,
            '&:hover': { bgcolor: '#E0E5EF' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!form.clientName || !form.address}
          sx={{
            flex: 1, borderRadius: '12px', py: '11px',
            bgcolor: '#0A2463', fontWeight: 600,
            '&:hover': { bgcolor: '#1A3A8F' },
            boxShadow: '0 4px 16px rgba(10,36,99,0.3)',
          }}
        >
          Create Job
        </Button>
      </DialogActions>
    </Dialog>
  );
}
