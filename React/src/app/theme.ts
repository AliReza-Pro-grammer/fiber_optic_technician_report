import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: { main: '#0A2463', light: '#2A4E9F', dark: '#06163D' },
    secondary: { main: '#3E92CC', light: '#6CB8E6', dark: '#1A6FA8' },
    background: { default: '#EEF1F8', paper: '#FFFFFF' },
    success: { main: '#2E7D32' },
    warning: { main: '#E65100' },
    error: { main: '#B71C1C' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(10,36,99,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 2px 12px rgba(10,36,99,0.25)' },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 6px 20px rgba(62,146,204,0.45)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, fontSize: '0.72rem' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 500 },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 10 },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20 },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: { root: { height: 60 } },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 0,
          '&.Mui-selected': { color: '#0A2463' },
        },
        label: { fontSize: '0.68rem', '&.Mui-selected': { fontSize: '0.68rem' } },
      },
    },
  },
});

export const STATUS_CONFIG = {
  new:       { label: 'New',       bg: '#E3F2FD', color: '#0D47A1', dot: '#1976D2', bar: '#1976D2' },
  cable:     { label: 'Cable',     bg: '#FFF3E0', color: '#BF360C', dot: '#E64A19', bar: '#E64A19' },
  fusion:    { label: 'Fusion',    bg: '#FBE9E7', color: '#7B1700', dot: '#BF360C', bar: '#BF360C' },
  connected: { label: 'Connected', bg: '#E8F5E9', color: '#1B5E20', dot: '#2E7D32', bar: '#2E7D32' },
};

export const REPORT_STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: '#FFF8E1', color: '#F57F17' },
  approved: { label: 'Approved', bg: '#E8F5E9', color: '#1B5E20' },
  rejected: { label: 'Rejected', bg: '#FFEBEE', color: '#B71C1C' },
};
