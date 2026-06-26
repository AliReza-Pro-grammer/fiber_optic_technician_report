import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CableIcon from '@mui/icons-material/Cable';
import FlareIcon from '@mui/icons-material/Flare';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAppContext } from '../../presentation/app_context';
import { User, UserRole } from '../../domain/entities';
import { MOCK_USERS } from '../../data/mock_data';

interface RoleCardConfig {
  role: UserRole;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const ROLES: RoleCardConfig[] = [
  {
    role: 'supervisor',
    label: 'Supervisor',
    subtitle: 'Manage jobs & reports',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />,
    color: '#0A2463',
    bg: '#E8EDF9',
  },
  {
    role: 'cable_tech',
    label: 'Cable Tech',
    subtitle: 'Cable installation',
    icon: <CableIcon sx={{ fontSize: 28 }} />,
    color: '#E65100',
    bg: '#FFF3E0',
  },
  {
    role: 'fusion_tech',
    label: 'Fusion Tech',
    subtitle: 'Fiber splicing',
    icon: <FlareIcon sx={{ fontSize: 28 }} />,
    color: '#BF360C',
    bg: '#FBE9E7',
  },
  {
    role: 'ceo',
    label: 'CEO',
    subtitle: 'Executive overview',
    icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
    color: '#1B5E20',
    bg: '#E8F5E9',
  },
];

export function LoginScreen() {
  const { login } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = () => {
    if (!selectedRole) return;
    const user = MOCK_USERS.find(u => u.role === selectedRole);
    if (user) login(user);
  };

  return (
    <Box sx={{
      flex: 1, overflowY: 'auto', bgcolor: '#0A2463',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Hero section */}
      <Box sx={{
        pt: 5, pb: 4, px: 3,
        background: 'linear-gradient(160deg, #0A2463 0%, #1A3A8F 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '22px',
          bgcolor: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        }}>
          <WifiTetheringIcon sx={{ fontSize: 42, color: '#3E92CC' }} />
        </Box>
        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.7rem', letterSpacing: '-0.5px' }}>
          FiberOps
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', mt: '4px' }}>
          Fiber Optic Job Management
        </Typography>

        {/* Status legend */}
        <Box sx={{
          display: 'flex', gap: '12px', mt: 3,
          bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '12px', px: 2, py: 1,
        }}>
          {[
            { label: 'New', color: '#1976D2' },
            { label: 'Cable', color: '#E64A19' },
            { label: 'Fusion', color: '#BF360C' },
            { label: 'Connected', color: '#2E7D32' },
          ].map(s => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: s.color }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: 500 }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Login card */}
      <Box sx={{
        flex: 1, bgcolor: '#F5F7FA', borderRadius: '28px 28px 0 0',
        mt: '-16px', px: 2.5, pt: 3, pb: 2,
      }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1A1A2E', mb: 0.5 }}>
          Select Your Role
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: '#78909C', mb: 2 }}>
          Choose the role to continue
        </Typography>

        {/* Role grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', mb: 2.5 }}>
          {ROLES.map(rc => {
            const isSelected = selectedRole === rc.role;
            return (
              <Box
                key={rc.role}
                onClick={() => setSelectedRole(rc.role)}
                sx={{
                  bgcolor: isSelected ? rc.color : 'white',
                  borderRadius: '16px',
                  p: '16px',
                  cursor: 'pointer',
                  border: `2px solid ${isSelected ? rc.color : '#E8ECF4'}`,
                  transition: 'all 0.2s',
                  position: 'relative',
                  boxShadow: isSelected ? `0 6px 20px ${rc.color}40` : '0 2px 8px rgba(10,36,99,0.06)',
                  '&:active': { transform: 'scale(0.96)' },
                }}
              >
                {isSelected && (
                  <CheckCircleOutlineIcon sx={{
                    position: 'absolute', top: 8, right: 8,
                    fontSize: 16, color: 'rgba(255,255,255,0.8)',
                  }} />
                )}
                <Box sx={{
                  width: 44, height: 44, borderRadius: '14px',
                  bgcolor: isSelected ? 'rgba(255,255,255,0.18)' : rc.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: '10px',
                  color: isSelected ? 'white' : rc.color,
                }}>
                  {rc.icon}
                </Box>
                <Typography sx={{
                  fontWeight: 700, fontSize: '0.85rem',
                  color: isSelected ? 'white' : '#1A1A2E',
                }}>
                  {rc.label}
                </Typography>
                <Typography sx={{
                  fontSize: '0.68rem',
                  color: isSelected ? 'rgba(255,255,255,0.75)' : '#90A4AE',
                  mt: '2px',
                }}>
                  {rc.subtitle}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {selectedRole && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#546E7A', mb: '6px', fontWeight: 500 }}>
              Signing in as
            </Typography>
            <Box sx={{
              bgcolor: 'white', borderRadius: '12px', p: '12px',
              display: 'flex', alignItems: 'center', gap: '12px',
              border: '1px solid #E8ECF4',
            }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '50%',
                bgcolor: ROLES.find(r => r.role === selectedRole)?.bg,
                color: ROLES.find(r => r.role === selectedRole)?.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem',
              }}>
                {MOCK_USERS.find(u => u.role === selectedRole)?.initials}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#1A1A2E' }}>
                  {MOCK_USERS.find(u => u.role === selectedRole)?.name}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#90A4AE' }}>
                  {MOCK_USERS.find(u => u.role === selectedRole)?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!selectedRole}
          onClick={handleLogin}
          sx={{
            bgcolor: '#0A2463',
            color: 'white',
            borderRadius: '14px',
            py: '14px',
            fontSize: '0.95rem',
            fontWeight: 600,
            boxShadow: selectedRole ? '0 8px 24px rgba(10,36,99,0.35)' : 'none',
            '&:hover': { bgcolor: '#1A3A8F' },
            '&:disabled': { bgcolor: '#CFD8DC', color: '#90A4AE' },
          }}
        >
          Enter Dashboard
        </Button>

        <Typography sx={{ textAlign: 'center', fontSize: '0.7rem', color: '#B0BEC5', mt: 2 }}>
          FiberOps v2.4 · Enterprise Edition
        </Typography>
      </Box>
    </Box>
  );
}
