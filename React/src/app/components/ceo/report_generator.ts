import { Job, CableReport, FusionReport } from '../../../domain/entities';

interface StatusStat { name: string; value: number; color: string }

interface ReportInput {
  generatedBy: string;
  jobs: Job[];
  cableReports: CableReport[];
  fusionReports: FusionReport[];
  statusDistribution: StatusStat[];
  completionRate: number;
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    new:       'background:#E3F2FD;color:#0D47A1',
    cable:     'background:#FFF3E0;color:#BF360C',
    fusion:    'background:#FBE9E7;color:#7B1700',
    connected: 'background:#E8F5E9;color:#1B5E20',
  };
  const s = map[status] ?? '';
  return `<span style="${s};padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;text-transform:capitalize">${status}</span>`;
}

export function generateReportHTML(data: ReportInput): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const totalJobs = data.jobs.length;
  const completedJobs = data.jobs.filter(j => j.status === 'connected');
  const pendingCable = data.cableReports.filter(r => r.status === 'pending').length;
  const pendingFusion = data.fusionReports.filter(r => r.status === 'pending').length;

  const statBoxes = data.statusDistribution.map(s => `
    <div style="flex:1;background:white;border-radius:10px;padding:14px 10px;text-align:center;border:1px solid #E0E0E0">
      <div style="font-size:28px;font-weight:800;color:${s.color};line-height:1">${s.value}</div>
      <div style="font-size:11px;color:#78909C;margin-top:4px;font-weight:500">${s.name}</div>
    </div>
  `).join('');

  const jobRows = data.jobs.map(job => {
    const cable = data.cableReports.find(r => r.jobId === job.id);
    const fusion = data.fusionReports.find(r => r.jobId === job.id);
    return `
      <tr style="border-bottom:1px solid #F0F0F0">
        <td style="padding:8px 10px;font-size:12px;font-weight:600;color:#1A1A2E">${job.id}</td>
        <td style="padding:8px 10px;font-size:12px;color:#1A1A2E">${job.clientName}</td>
        <td style="padding:8px 10px;font-size:11px;color:#546E7A;max-width:160px">${job.address}</td>
        <td style="padding:8px 10px;font-size:12px;color:#546E7A">${job.provider}</td>
        <td style="padding:8px 10px">${statusBadge(job.status)}</td>
        <td style="padding:8px 10px;text-align:center;font-size:11px">${cable ? `<span style="color:${cable.status === 'approved' ? '#1B5E20' : cable.status === 'rejected' ? '#B71C1C' : '#E65100'}">${cable.status}</span>` : '<span style="color:#B0BEC5">—</span>'}</td>
        <td style="padding:8px 10px;text-align:center;font-size:11px">${fusion ? `<span style="color:${fusion.status === 'approved' ? '#1B5E20' : fusion.status === 'rejected' ? '#B71C1C' : '#E65100'}">${fusion.status}</span>` : '<span style="color:#B0BEC5">—</span>'}</td>
        <td style="padding:8px 10px;font-size:11px;color:#90A4AE">${new Date(job.updatedAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</td>
      </tr>
    `;
  }).join('');

  const completedRows = completedJobs.map(job => {
    const cable = data.cableReports.find(r => r.jobId === job.id);
    const fusion = data.fusionReports.find(r => r.jobId === job.id);
    return `
      <tr style="border-bottom:1px solid #F0F0F0">
        <td style="padding:10px 12px;font-size:12px;font-weight:600;color:#1A1A2E">${job.id}</td>
        <td style="padding:10px 12px;font-size:12px;color:#1A1A2E">${job.clientName}</td>
        <td style="padding:10px 12px;font-size:11px;color:#546E7A">${job.address}</td>
        <td style="padding:10px 12px;font-size:12px;color:#546E7A">${job.provider}</td>
        <td style="padding:10px 12px;font-size:11px;color:#546E7A">${cable?.cableLength ? cable.cableLength + 'm' : '—'}</td>
        <td style="padding:10px 12px;font-size:11px;color:#546E7A">${cable?.cableType ?? '—'}</td>
        <td style="padding:10px 12px;font-size:11px;color:#546E7A">${fusion?.pigtails ?? '—'} / ${fusion?.adaptors ?? '—'}</td>
        <td style="padding:10px 12px;font-size:11px;color:#90A4AE">${new Date(job.updatedAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>FiberOps Executive Report — ${dateStr}</title>
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
    .header-meta { text-align: right; font-size: 12px; opacity: 0.75; }
    .section { padding: 24px 36px; }
    .section-title {
      font-size: 13px; font-weight: 700; color: #0A2463;
      text-transform: uppercase; letter-spacing: 0.08em;
      border-bottom: 2px solid #E8EDF9; padding-bottom: 8px; margin-bottom: 16px;
    }
    .stats-row { display: flex; gap: 12px; margin-bottom: 24px; }
    .kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 0; }
    .kpi-box {
      background: white; border-radius: 10px; padding: 16px 14px;
      border: 1px solid #E8EDF9; text-align: center;
      box-shadow: 0 2px 8px rgba(10,36,99,0.06);
    }
    .kpi-value { font-size: 28px; font-weight: 800; color: #0A2463; line-height: 1; }
    .kpi-label { font-size: 11px; color: #78909C; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #F8F9FD; }
    th { padding: 10px 10px; font-size: 11px; font-weight: 700; color: #546E7A; text-align: left; text-transform: uppercase; letter-spacing: 0.05em; }
    .footer { background: #F8F9FD; padding: 16px 36px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E8EDF9; }
    .footer-left { font-size: 11px; color: #90A4AE; }
    .print-btn {
      background: #0A2463; color: white; border: none;
      padding: 10px 24px; border-radius: 8px; font-size: 13px;
      font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .print-btn:hover { background: #1A3A8F; }
    .completion-bar-bg { background: #E8EDF9; border-radius: 99px; height: 8px; flex: 1; }
    .completion-bar-fill { background: #2E7D32; border-radius: 99px; height: 8px; }
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
      .page { box-shadow: none; }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo">Fiber<span>Ops</span></div>
      <div style="font-size:13px;opacity:0.7;margin-top:4px">Executive Summary Report</div>
    </div>
    <div class="header-meta">
      <div style="font-size:14px;font-weight:600;opacity:1">${dateStr}</div>
      <div>Generated at ${timeStr}</div>
      <div style="margin-top:4px">Prepared for: ${data.generatedBy}</div>
    </div>
  </div>

  <!-- KPI Summary -->
  <div class="section">
    <div class="section-title">Key Performance Indicators</div>
    <div class="kpi-row">
      <div class="kpi-box">
        <div class="kpi-value">${totalJobs}</div>
        <div class="kpi-label">Total Jobs</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-value" style="color:#2E7D32">${data.completionRate}%</div>
        <div class="kpi-label">Completion Rate</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-value" style="color:#E65100">${pendingCable + pendingFusion}</div>
        <div class="kpi-label">Pending Reports</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-value" style="color:#1B5E20">${completedJobs.length}</div>
        <div class="kpi-label">Connected</div>
      </div>
    </div>

    <!-- Completion progress -->
    <div style="margin-top:20px;background:#F8F9FD;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:16px">
      <div style="font-size:12px;font-weight:600;color:#546E7A;white-space:nowrap">Pipeline Progress</div>
      <div class="completion-bar-bg">
        <div class="completion-bar-fill" style="width:${data.completionRate}%"></div>
      </div>
      <div style="font-size:13px;font-weight:800;color:#2E7D32;white-space:nowrap">${data.completionRate}%</div>
    </div>

    <!-- Status breakdown -->
    <div style="margin-top:16px">
      <div style="font-size:11px;font-weight:700;color:#546E7A;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px">Status Breakdown</div>
      <div style="display:flex;gap:10px">
        ${statBoxes}
      </div>
    </div>
  </div>

  <!-- Completed Jobs Detail -->
  <div class="section" style="padding-top:0">
    <div class="section-title">Completed Jobs — Technical Detail</div>
    ${completedJobs.length === 0
      ? '<p style="color:#90A4AE;font-size:13px">No completed jobs yet.</p>'
      : `<table>
          <thead>
            <tr>
              <th>Job ID</th><th>Client</th><th>Address</th><th>Provider</th>
              <th>Cable (m)</th><th>Cable Type</th><th>Pigtails/Adaptors</th><th>Completed</th>
            </tr>
          </thead>
          <tbody>${completedRows}</tbody>
        </table>`
    }
  </div>

  <!-- Full Job Ledger -->
  <div class="section" style="padding-top:0">
    <div class="section-title">Full Job Ledger</div>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Client</th><th>Address</th><th>Provider</th>
          <th>Status</th><th>Cable Rpt</th><th>Fusion Rpt</th><th>Last Updated</th>
        </tr>
      </thead>
      <tbody>${jobRows}</tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      <div style="font-weight:600;color:#546E7A">FiberOps Enterprise · Confidential</div>
      <div>This report was automatically generated on ${dateStr} at ${timeStr}</div>
    </div>
    <button class="print-btn no-print" onclick="window.print()">
      🖨 Print / Save as PDF
    </button>
  </div>
</div>
</body>
</html>`;
}
