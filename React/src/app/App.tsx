import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'sonner';
import { muiTheme } from './theme';
import { AppContextProvider, useAppContext } from '../presentation/app_context';
import { MobileFrame } from './components/shared/MobileFrame';
import { LoginScreen } from './components/LoginScreen';
import { SupervisorDashboard } from './components/supervisor/SupervisorDashboard';
import { ReportDetailsView } from './components/supervisor/ReportDetailsView';
import { CableTechDashboard } from './components/technician/CableTechDashboard';
import { FusionTechDashboard } from './components/technician/FusionTechDashboard';
import { CableReportForm } from './components/technician/CableReportForm';
import { FusionReportForm } from './components/technician/FusionReportForm';
import { CEODashboard } from './components/ceo/CEODashboard';

function AppContent() {
  const { navState } = useAppContext();

  switch (navState.screen) {
    case 'login':                    return <LoginScreen />;
    case 'supervisor_home':          return <SupervisorDashboard />;
    case 'supervisor_reports':       return <SupervisorDashboard />;
    case 'supervisor_report_detail': return <ReportDetailsView />;
    case 'cable_home':               return <CableTechDashboard />;
    case 'cable_report_form':        return <CableReportForm />;
    case 'fusion_home':              return <FusionTechDashboard />;
    case 'fusion_report_form':       return <FusionReportForm />;
    case 'ceo_home':                 return <CEODashboard />;
    default:                         return <LoginScreen />;
  }
}

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppContextProvider>
        <MobileFrame>
          <AppContent />
        </MobileFrame>
      </AppContextProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontFamily: '"Roboto", sans-serif',
            fontSize: '0.85rem',
          },
        }}
      />
    </ThemeProvider>
  );
}
