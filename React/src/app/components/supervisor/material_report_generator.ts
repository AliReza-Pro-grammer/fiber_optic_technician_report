import { UsedItemsSummary, TechnicianJobStats, Job, CableReport, FusionReport } from '../../../domain/entities';

interface MaterialReportInput {
  generatedBy: string;
  usedItemsSummary: UsedItemsSummary;
  technicianStats: TechnicianJobStats[];
  jobStats: { new: number; cable: number; fusion: number; connected: number; total: number };
  jobs: Job[];
  cableReports: CableReport[];
  fusionReports: FusionReport[];
}

export function generateMaterialReportHTML(data: MaterialReportInput): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const materialRows = [
    { name: 'Double-braced Cable', value: data.usedItemsSummary.totalDoubleBracedCable, unit: 'm', type: 'Cable' },
    { name: 'Three-braced Cable', value: data.usedItemsSummary.totalThreeBracedCable, unit: 'm', type: 'Cable' },
    { name: 'Cable Clamps (Cable)', value: data.usedItemsSummary.totalCableClamps, unit: '', type: 'Cable' },
    { name: 'ATB (Access Terminal Box)', value: data.usedItemsSummary.totalATB, unit: '', type: 'Fusion' },
    { name: 'Pigtails', value: data.usedItemsSummary.totalPigtails, unit: '', type: 'Fusion' },
    { name: 'Adaptors', value: data.usedItemsSummary.totalAdaptors, unit: '', type: 'Fusion' },
    { name: 'Double-Adaptors', value: data.usedItemsSummary.totalDoubleAdaptors, unit: '', type: 'Fusion' },
    { name: 'TB*8 (8-port Box)', value: data.usedItemsSummary.totalTB8, unit: '', type: 'Fusion' },
    { name: 'TB*4 (4-port Box)', value: data.usedItemsSummary.totalTB4, unit: '', type: 'Fusion' },
    { name: 'Splitters', value: data.usedItemsSummary.totalSplitters, unit: '', type: 'Fusion' },
    { name: 'Cable Clamps (Fusion)', value: data.usedItemsSummary.totalFusionCableClamps, unit: '', type: 'Fusion' },
  ].map(m => `
    <tr style="border-bottom:1px solid #F0F0F0">
      <td style="padding:8px 10px;font-size:12px;color:#546E7A">${m.name}</td>
      <td style="padding:8px 10px;font-size:12px;text-align:center">${m.type}</td>
      <td style="padding:8px 10px;font-size:12px;font-weight:700;text-align:right;color:#0A2463">${m.value.toLocaleString()} ${m.unit}</td>
    </tr>
  `).join('');

  const techRows = data.technicianStats.map(t => `
    <tr style="border-bottom:1px solid #F0F0F0">
      <td style="padding:10px 12px;font-size:12px;font-weight:600;color:#1A1A2E">${t.technicianName}</td>
      <td style="padding:10px 12px;font-size:11px;text-align:center">
        <span style="background:${t.role === 'cable_tech' ? '#FFF3E0' : '#FBE9E7'};color:${t.role === 'cable_tech' ? '#E65100' : '#BF360C'};padding:2px 8px;border-radius:99px;font-weight:700">${t.role === 'cable_tech' ? 'CABLE' : 'FUSION'}</span>
      </td>
      <td style="padding:10px 12px;font-size:12px;text-align:center;font-weight:700;color:#1B5E20">${t.jobsCompleted}</td>
      <td style="padding:10px 12px;font-size:12px;text-align:center;color:#E65100">${t.jobsPending}</td>
      <td style="padding:10px 12px;font-size:12px;text-align:center;font-weight:600">${t.totalJobs}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>FiberOps Material Usage Report — ${dateStr}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Roboto', Arial, sans-serif; background: #F5F7FA; color: #1A1A2E; }
    .page { max-width: 900px; margin: 0 auto; background: white; }
    .header {
      background: linear-gradient(135deg, #0A2463 0%, #1A3A8F 100%);
      color: white; padding: 28px 36px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .logo span { color: #3E92CC; }
    .section { padding: 24px 36px; }
    .section-title {
      font-size: 13px; font-weight: 700; color: #0A2463;
      text-transform: uppercase; letter-spacing: 0.08em;
      border-bottom: 2px solid #E8EDF9; padding-bottom: 8px; margin-bottom: 16px;
    }
    .stats-row { display: flex; gap: 12px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #F8F9FD; }
    th { padding: 10px 10px; font-size: 11px; font-weight: 700; color: #546E7A; text-align: left; text-transform: uppercase; letter-spacing: 0.05em; }
    .footer { background: #F8F9FD; padding: 16px 36px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E8EDF9; }
    .print-btn {
      background: #0A2463; color: white; border: none;
      padding: 10px 24px; border-radius: 8px; font-size: 13px;
      font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .print-btn:hover { background: #1A3A8F; }
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
      .page { box-shadow: none; }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo">Fiber<span>Ops</span></div>
      <div style="font-size:13px;opacity:0.7;margin-top:4px">Material Usage & Technician Report</div>
    </div>
    <div style="text-align:right;font-size:12px;opacity:0.75">
      <div style="font-size:14px;font-weight:600;opacity:1">${dateStr}</div>
      <div>Generated at ${timeStr}</div>
    </div>
  </div>

  <!-- Job Summary -->
  <div class="section">
    <div class="section-title">Job Pipeline Overview</div>
    <div class="stats-row">
      <div style="flex:1;background:white;border-radius:10px;padding:16px 14px;text-align:center;border:1px solid #E8EDF9;box-shadow:0 2px 8px rgba(10,36,99,0.06)">
        <div style="font-size:28px;font-weight:800;color:#1565C0">${data.jobStats.new}</div>
        <div style="font-size:11px;color:#78909C;margin-top:4px">New Jobs</div>
      </div>
      <div style="flex:1;background:white;border-radius:10px;padding:16px 14px;text-align:center;border:1px solid #E8EDF9;box-shadow:0 2px 8px rgba(10,36,99,0.06)">
        <div style="font-size:28px;font-weight:800;color:#E65100">${data.jobStats.cable}</div>
        <div style="font-size:11px;color:#78909C;margin-top:4px">Cable Stage</div>
      </div>
      <div style="flex:1;background:white;border-radius:10px;padding:16px 14px;text-align:center;border:1px solid #E8EDF9;box-shadow:0 2px 8px rgba(10,36,99,0.06)">
        <div style="font-size:28px;font-weight:800;color:#BF360C">${data.jobStats.fusion}</div>
        <div style="font-size:11px;color:#78909C;margin-top:4px">Fusion Stage</div>
      </div>
      <div style="flex:1;background:white;border-radius:10px;padding:16px 14px;text-align:center;border:1px solid #E8EDF9;box-shadow:0 2px 8px rgba(10,36,99,0.06)">
        <div style="font-size:28px;font-weight:800;color:#1B5E20">${data.jobStats.connected}</div>
        <div style="font-size:11px;color:#78909C;margin-top:4px">Connected</div>
      </div>
    </div>
  </div>

  <!-- Materials Summary -->
  <div class="section" style="padding-top:0">
    <div class="section-title">Materials Used Summary</div>
    <table>
      <thead>
        <tr>
          <th>Material</th>
          <th style="text-align:center">Type</th>
          <th style="text-align:right">Total Used</th>
        </tr>
      </thead>
      <tbody>${materialRows}</tbody>
    </table>
  </div>

  <!-- Technician Performance -->
  <div class="section" style="padding-top:0">
    <div class="section-title">Technician Performance</div>
    <table>
      <thead>
        <tr>
          <th>Technician</th>
          <th style="text-align:center">Role</th>
          <th style="text-align:center">Completed</th>
          <th style="text-align:center">Pending</th>
          <th style="text-align:center">Total Assigned</th>
        </tr>
      </thead>
      <tbody>${techRows}</tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div style="font-size:11px;color:#90A4AE">
      <div style="font-weight:600;color:#546E7A">FiberOps Enterprise</div>
      <div>Generated on ${dateStr} at ${timeStr}</div>
    </div>
    <button class="print-btn no-print" onclick="window.print()">
      Print / Save as PDF
    </button>
  </div>
</div>
</body>
</html>`;
}
