import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WifiIcon from '@mui/icons-material/Wifi';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

export function MobileFrame({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{
      width: '100vw', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: '#111827',
      backgroundImage: 'radial-gradient(ellipse at 30% 20%, #1e2a4a 0%, #111827 60%)',
      py: 2,
    }}>
      {/* Phone outer shell */}
      <Box sx={{
        width: 393,
        height: 852,
        position: 'relative',
        borderRadius: '52px',
        background: 'linear-gradient(145deg, #3a3a3a, #1a1a1a)',
        padding: '12px',
        boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        {/* Screen */}
        <Box sx={{
          width: '100%', height: '100%',
          borderRadius: '42px',
          overflow: 'hidden',
          bgcolor: '#EEF1F8',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          {/* Status bar */}
          <Box sx={{
            height: 44,
            bgcolor: '#0A2463',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '22px',
            flexShrink: 0,
            position: 'relative',
            zIndex: 10,
          }}>
            <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 700, letterSpacing: '-0.3px' }}>
              {time}
            </Typography>
            {/* Dynamic island */}
            <Box sx={{
              position: 'absolute', top: 10, left: '50%',
              transform: 'translateX(-50%)',
              width: 120, height: 34,
              bgcolor: '#0a0a0a',
              borderRadius: 99,
            }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <SignalCellularAltIcon sx={{ color: 'white', fontSize: 14 }} />
              <WifiIcon sx={{ color: 'white', fontSize: 14 }} />
              <BatteryFullIcon sx={{ color: 'white', fontSize: 14 }} />
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children}
          </Box>

          {/* Home indicator */}
          <Box sx={{
            height: 26, bgcolor: 'background.paper',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Box sx={{ width: 120, height: 5, bgcolor: '#00000030', borderRadius: 99 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
