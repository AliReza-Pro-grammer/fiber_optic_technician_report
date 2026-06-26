# Plan: Fiber Optic Job Management System — Mobile UI

## Context
Build a high-fidelity, enterprise-grade mobile application UI for a Fiber Optic Job Management System. The app tracks jobs through a 4-state workflow (New → Cable → Fusion → Connected) with distinct role-based dashboards for Supervisor, Cable Technician, Fusion Technician, and CEO. This is a fully interactive React SPA with mock data — no backend required.

---

## Architecture

### Navigation Pattern
Single-page app with a `currentScreen` + `currentUser` state in `App.tsx`. Navigation via state transitions (no react-router needed — this is a mobile UI prototype). Bottom tab bar per role.

### Data Model (TypeScript interfaces in `src/app/types.ts`)
```ts
type JobStatus = 'new' | 'cable' | 'fusion' | 'connected'
type UserRole = 'supervisor' | 'cable_tech' | 'fusion_tech' | 'ceo'
type ReportStatus = 'pending' | 'approved' | 'rejected'

interface Job { id, clientName, address, status, assignedCableTech, assignedFusionTech, cableReport?, fusionReport?, createdAt, notes }
interface CableReport { cableLength, cableType, details, submittedBy, submittedAt, status: ReportStatus }
interface FusionReport { pigtails, adaptors, atb, tb, details, submittedBy, submittedAt, status: ReportStatus }
interface User { id, name, role: UserRole, avatar }
```

### Mock Data
15–20 jobs spread across all 4 states. Pre-populated cable/fusion reports on some jobs. 4 mock users (one per role).

---

## Color System for Job States
Defined as inline constants (not theme.css, since these are app-specific semantic tokens):
```ts
const STATUS_COLORS = {
  new:       { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', dot: '#3B82F6' },
  cable:     { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', dot: '#F59E0B' },
  fusion:    { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', dot: '#F97316' },
  connected: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', dot: '#22C55E' },
}
```

---

## File Structure

```
src/app/
├── App.tsx                          ← main nav state + mock data store
├── types.ts                         ← shared TypeScript interfaces
├── mockData.ts                      ← 15–20 jobs, 4 users
├── constants.ts                     ← STATUS_COLORS, STATUS_LABELS, ROLE_CONFIG
└── components/
    ├── ui/                          ← existing shadcn/ui (unchanged)
    ├── figma/                       ← existing (unchanged)
    ├── LoginScreen.tsx              ← role picker + credential form
    ├── MobileFrame.tsx              ← phone chrome wrapper (375px, notch, status bar)
    ├── shared/
    │   ├── JobStatusBadge.tsx       ← colored pill badge for job state
    │   ├── JobCard.tsx              ← reusable card: client info, badge, quick actions
    │   ├── BottomNav.tsx            ← role-specific tab bar
    │   └── TopHeader.tsx            ← screen header with back/action buttons
    ├── supervisor/
    │   ├── SupervisorDashboard.tsx  ← stats row, job list, filter tabs
    │   ├── AddJobModal.tsx          ← Dialog with new job form
    │   └── ReportCenter.tsx        ← incoming reports list with approve/reject/edit
    ├── technician/
    │   ├── CableTechDashboard.tsx   ← assigned jobs, todo emphasis, status update
    │   ├── FusionTechDashboard.tsx  ← same pattern for fusion role
    │   ├── CableReportForm.tsx      ← step-form: ClientName, Address, CableLength, CableType, Details
    │   └── FusionReportForm.tsx     ← step-form: ClientName, Address, Pigtails, Adaptors, ATB, TB, Details
    ├── ceo/
    │   └── CEODashboard.tsx         ← summary stats, recharts bar/pie, completed jobs list
    └── ReportDetailsView.tsx        ← full report read view + supervisor actions (approve/reject/edit)
```

---

## Screen Inventory

| Screen | Component | User Roles |
|---|---|---|
| Login / Role Selection | `LoginScreen` | All |
| Supervisor Home | `SupervisorDashboard` | Supervisor |
| Add Job Modal | `AddJobModal` | Supervisor |
| Report Center | `ReportCenter` | Supervisor |
| Report Details + Actions | `ReportDetailsView` | Supervisor |
| Cable Tech Home | `CableTechDashboard` | Cable Tech |
| Cable Report Form | `CableReportForm` | Cable Tech |
| Fusion Tech Home | `FusionTechDashboard` | Fusion Tech |
| Fusion Report Form | `FusionReportForm` | Fusion Tech |
| CEO Dashboard | `CEODashboard` | CEO |

---

## Key Component Details

### `JobCard.tsx`
- Client name (bold), address (muted), date
- `JobStatusBadge` on the right with colored dot + label
- Quick-action buttons conditional on role: Supervisor gets "View Report" / "Reassign"; Techs get "Update Status" / "Submit Report"; CEO has none
- Subtle left border colored by status

### `SupervisorDashboard.tsx`
- Header: "FiberOps" logo, notification bell with badge count
- Stats row: 4 cards (New / Cable / Fusion / Connected counts)
- Filter tabs (All / New / Cable / Fusion / Connected) using shadcn `Tabs`
- Scrollable `JobCard` list
- FAB "+" button → triggers `AddJobModal`
- Bottom nav: Jobs | Reports | Settings

### `CableTechDashboard.tsx`
- "My Jobs" header with user avatar
- "To-Do" section highlighted: jobs in 'new' or 'cable' state assigned to this tech
- "Completed" section: jobs in 'fusion' or 'connected'
- Each job card shows "Submit Report" CTA if no report yet, "View Submitted" if report exists
- Bottom nav: Jobs | Submit | Profile

### `FusionTechDashboard.tsx`
- Same pattern as Cable, filtered for fusion-stage jobs
- "To-Do" = jobs at 'cable' state ready for fusion
- "Submit Report" CTA opens `FusionReportForm`

### `CableReportForm.tsx` / `FusionReportForm.tsx`
- Multi-step form using `react-hook-form` (v7.55.0)
- Step indicator at top (Step 1 of 2, Step 2 of 2)
- Cable fields: Client Name, Address, Cable Length (with unit), Cable Type (Select: SM/MM/OPGW), Details (textarea)
- Fusion fields: Client Name, Address, Pigtails (number), Adaptors (number), ATB, TB, Details (textarea)
- "Next / Back / Submit" buttons
- Submit triggers a mock state update and shows success toast (sonner)

### `CEODashboard.tsx`
- Welcome header with CEO name and date
- Summary KPI cards: Total Jobs, Completion Rate %, Jobs This Month
- Recharts `PieChart` showing distribution by status
- Recharts `BarChart` showing monthly job completions (last 6 months mock data)
- Scrollable list of completed jobs (Connected status) with "View Report" action
- Read-only (no action buttons)

### `ReportDetailsView.tsx`
- Full report card: all submitted fields displayed in a clean read layout
- Technician info + timestamp
- Supervisor-only action bar: "Approve" (green), "Reject" (red destructive), "Edit" (outline) buttons
- Status chip showing current approval state
- Job status update toggle (changes job from cable→fusion or fusion→connected)

### `AddJobModal.tsx`
- shadcn `Dialog`
- Fields: Client Name, Address, Phone, Provider (Select), Notes
- "Assign Cable Tech" dropdown (Select from mock techs)
- Submit creates new job with 'new' status

---

## Existing Components to Leverage
All from `src/app/components/ui/`:
- `Card`, `CardHeader`, `CardContent` → job cards, stat cards
- `Badge` → status labels
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` → filter tabs
- `Dialog`, `DialogContent`, `DialogHeader` → modals
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl` + `Input`, `Textarea`, `Select` → forms
- `Progress` → workflow progress bar
- `Avatar` → user avatars in headers
- `Separator` → section dividers
- `Sheet` → slide-in panels (if needed for report details)
- `Skeleton` → loading states in lists
- `ScrollArea` → scrollable job lists
- `Switch` → status toggles

Icons: `lucide-react` (Wifi, Cable, Layers, CheckCircle2, Plus, Bell, ChevronRight, User, FileText, Settings, BarChart3, TrendingUp)

Charts: `recharts` (PieChart, BarChart) in CEO dashboard

---

## Implementation Order
1. `types.ts` + `mockData.ts` + `constants.ts`
2. `MobileFrame.tsx` + `LoginScreen.tsx`
3. Shared: `JobStatusBadge.tsx` + `JobCard.tsx` + `BottomNav.tsx` + `TopHeader.tsx`
4. `SupervisorDashboard.tsx` + `AddJobModal.tsx` + `ReportCenter.tsx`
5. `CableTechDashboard.tsx` + `CableReportForm.tsx`
6. `FusionTechDashboard.tsx` + `FusionReportForm.tsx`
7. `CEODashboard.tsx`
8. `ReportDetailsView.tsx`
9. Wire everything in `App.tsx`

---

## Verification
- All 4 role logins reachable from `LoginScreen`
- Supervisor can add job (modal), view report center, approve/reject reports
- Cable Tech can see assigned jobs, submit cable report, get success feedback
- Fusion Tech can see assigned jobs, submit fusion report
- CEO sees charts and completed jobs (read-only)
- Job status badge colors are correct: New=Blue, Cable=Amber, Fusion=Orange, Connected=Green
- Mobile frame renders at ~375px width, centered, with proper overflow scrolling
