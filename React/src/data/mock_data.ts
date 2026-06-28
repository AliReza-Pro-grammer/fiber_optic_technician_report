import { User, Job, CableReport, FusionReport } from '../domain/entities';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmed Hassan', role: 'supervisor', email: 'ahmed@fiberops.net', initials: 'AH' },
  { id: 'u2', name: 'Omar Khalid', role: 'cable_tech', email: 'omar@fiberops.net', initials: 'OK' },
  { id: 'u3', name: 'Yusuf Nasser', role: 'fusion_tech', email: 'yusuf@fiberops.net', initials: 'YN' },
  { id: 'u4', name: 'Khalid Ibrahim', role: 'ceo', email: 'khalid@fiberops.net', initials: 'KI' },
];

export const MOCK_JOBS: Job[] = [
  // NEW (4)
  {
    id: 'J001', clientName: 'Mohammed Al-Rashidi', virtualNumber: 'V-2026-001', address: '12 King Fahd Road, Riyadh',
    phone: '+966 50 111 2233', provider: 'STC', status: 'new',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'New residential fiber connection.',
    createdAt: '2026-06-01T08:00:00Z', updatedAt: '2026-06-01T08:00:00Z',
  },
  {
    id: 'J002', clientName: 'Fatima Al-Zahra', virtualNumber: 'V-2026-002', address: '45 Prince Abdullah St, Jeddah',
    phone: '+966 55 222 3344', provider: 'Mobily', status: 'new',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Commercial office, 3rd floor.',
    createdAt: '2026-06-02T09:30:00Z', updatedAt: '2026-06-02T09:30:00Z',
  },
  {
    id: 'J003', clientName: 'Hassan Al-Mutairi', virtualNumber: 'V-2026-003', address: '8 Corniche Road, Dammam',
    phone: '+966 59 333 4455', provider: 'Etisalat', status: 'new',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Upgrade from copper to fiber.',
    createdAt: '2026-06-03T10:00:00Z', updatedAt: '2026-06-03T10:00:00Z',
  },
  {
    id: 'J004', clientName: 'Sara Al-Ghamdi', virtualNumber: 'V-2026-004', address: '23 Tahlia Street, Riyadh',
    phone: '+966 50 444 5566', provider: 'Zain', status: 'new',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Residential duplex.',
    createdAt: '2026-06-04T11:15:00Z', updatedAt: '2026-06-04T11:15:00Z',
  },
  // CABLE (4)
  {
    id: 'J005', clientName: 'Ahmed Bin Faisal', virtualNumber: 'V-2026-005', address: '67 Airport Road, Jeddah',
    phone: '+966 55 555 6677', provider: 'STC', status: 'cable',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Long-distance run, requires conduit.',
    createdAt: '2026-05-25T08:00:00Z', updatedAt: '2026-06-05T14:00:00Z',
  },
  {
    id: 'J006', clientName: 'Khalid Al-Otaibi', virtualNumber: 'V-2026-006', address: '3 Northern Ring Road, Riyadh',
    phone: '+966 50 666 7788', provider: 'Mobily', status: 'cable',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Building entry through basement.',
    createdAt: '2026-05-26T09:00:00Z', updatedAt: '2026-06-06T10:00:00Z',
  },
  {
    id: 'J007', clientName: 'Norah Al-Farsi', virtualNumber: 'V-2026-007', address: '89 Al-Salam Road, Medina',
    phone: '+966 59 777 8899', provider: 'Ooredoo', status: 'cable',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Multi-unit residential block.',
    createdAt: '2026-05-27T10:00:00Z', updatedAt: '2026-06-07T09:00:00Z',
  },
  {
    id: 'J008', clientName: 'Omar Al-Dosari', virtualNumber: 'V-2026-008', address: '15 Hamad Town, Manama',
    phone: '+973 39 888 9900', provider: 'Etisalat', status: 'cable',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Cross-street cable run needed.',
    createdAt: '2026-05-28T11:00:00Z', updatedAt: '2026-06-08T08:00:00Z',
  },
  // FUSION (4)
  {
    id: 'J009', clientName: 'Layla Al-Yami', virtualNumber: 'V-2026-009', address: '56 Muaither, Doha',
    phone: '+974 50 999 1100', provider: 'Ooredoo', status: 'fusion',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'High-density fiber area.',
    createdAt: '2026-05-18T08:00:00Z', updatedAt: '2026-06-01T12:00:00Z',
  },
  {
    id: 'J010', clientName: 'Rayan Al-Shehri', virtualNumber: 'V-2026-010', address: '22 West Bay, Doha',
    phone: '+974 55 100 2200', provider: 'Zain', status: 'fusion',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Corporate tower, floors 5–10.',
    createdAt: '2026-05-19T09:00:00Z', updatedAt: '2026-06-02T13:00:00Z',
  },
  {
    id: 'J011', clientName: 'Aisha Al-Subaie', virtualNumber: 'V-2026-011', address: '78 Khalidiyah, Abu Dhabi',
    phone: '+971 50 200 3300', provider: 'Etisalat', status: 'fusion',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Shared access corridor.',
    createdAt: '2026-05-20T10:00:00Z', updatedAt: '2026-06-03T14:00:00Z',
  },
  {
    id: 'J012', clientName: 'Majed Al-Harbi', virtualNumber: 'V-2026-012', address: '4 Jumeirah, Dubai',
    phone: '+971 55 300 4400', provider: 'STC', status: 'fusion',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Villa with garden conduit.',
    createdAt: '2026-05-21T11:00:00Z', updatedAt: '2026-06-04T15:00:00Z',
  },
  // CONNECTED (4)
  {
    id: 'J013', clientName: 'Badr Al-Rashidi', virtualNumber: 'V-2026-013', address: '91 Al-Quoz, Dubai',
    phone: '+971 50 400 5500', provider: 'Mobily', status: 'connected',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Industrial unit, completed.',
    createdAt: '2026-05-10T08:00:00Z', updatedAt: '2026-05-30T16:00:00Z',
  },
  {
    id: 'J014', clientName: 'Dina Al-Saud', virtualNumber: 'V-2026-014', address: '34 Al-Barsha, Dubai',
    phone: '+971 55 500 6600', provider: 'Zain', status: 'connected',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Apartment complex, fully wired.',
    createdAt: '2026-05-11T09:00:00Z', updatedAt: '2026-05-31T14:00:00Z',
  },
  {
    id: 'J015', clientName: 'Fahad Al-Malik', virtualNumber: 'V-2026-015', address: '17 Al-Ain Downtown',
    phone: '+971 50 600 7700', provider: 'Etisalat', status: 'connected',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Smart home integration done.',
    createdAt: '2026-05-12T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'J016', clientName: 'Hind Al-Zahrani', virtualNumber: 'V-2026-016', address: '62 Al-Matar, Riyadh',
    phone: '+966 55 700 8800', provider: 'STC', status: 'connected',
    assignedCableTechId: 'u2', assignedFusionTechId: 'u3', notes: 'Government facility, certified.',
    createdAt: '2026-05-13T11:00:00Z', updatedAt: '2026-06-02T11:00:00Z',
  },
];

export const MOCK_CABLE_REPORTS: CableReport[] = [
  {
    id: 'CR001', jobId: 'J005', submittedById: 'u2',
    clientName: 'Ahmed Bin Faisal', address: '67 Airport Road, Jeddah',
    doubleBracedCableLength: '280', threeBracedCableLength: '170', cableClampCount: '12',
    cableLength: '450', cableType: 'Single Mode G.652D',
    details: 'Cable run along the north perimeter wall. Conduit installed in all exposed sections.',
    submittedAt: '2026-06-05T14:00:00Z', status: 'pending', reviewNote: '',
  },
  {
    id: 'CR002', jobId: 'J006', submittedById: 'u2',
    clientName: 'Khalid Al-Otaibi', address: '3 Northern Ring Road, Riyadh',
    doubleBracedCableLength: '520', threeBracedCableLength: '300', cableClampCount: '18',
    cableLength: '820', cableType: 'Single Mode G.652D',
    details: 'Cable entered through basement utility shaft. Protection sleeve applied at entry point.',
    submittedAt: '2026-06-06T10:00:00Z', status: 'approved', reviewNote: '',
  },
  {
    id: 'CR003', jobId: 'J007', submittedById: 'u2',
    clientName: 'Norah Al-Farsi', address: '89 Al-Salam Road, Medina',
    doubleBracedCableLength: '800', threeBracedCableLength: '400', cableClampCount: '24',
    cableLength: '1200', cableType: 'Multi Mode OM3',
    details: 'Multi-unit installation across 8 floors. Vertical cable risers used.',
    submittedAt: '2026-06-07T09:00:00Z', status: 'approved', reviewNote: '',
  },
  {
    id: 'CR004', jobId: 'J008', submittedById: 'u2',
    clientName: 'Omar Al-Dosari', address: '15 Hamad Town, Manama',
    doubleBracedCableLength: '200', threeBracedCableLength: '150', cableClampCount: '8',
    cableLength: '350', cableType: 'Single Mode G.657A',
    details: 'Underground cross-street run. Directional boring used at street crossing.',
    submittedAt: '2026-06-08T08:00:00Z', status: 'rejected', reviewNote: 'Missing cable test readings. Please resubmit with OTDR test results.',
  },
  { id: 'CR005', jobId: 'J009', submittedById: 'u2', clientName: 'Layla Al-Yami', address: '56 Muaither, Doha', doubleBracedCableLength: '400', threeBracedCableLength: '200', cableClampCount: '10', cableLength: '600', cableType: 'Single Mode G.652D', details: 'High-density area, 12-fiber bundle.', submittedAt: '2026-05-25T10:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'CR006', jobId: 'J010', submittedById: 'u2', clientName: 'Rayan Al-Shehri', address: '22 West Bay, Doha', doubleBracedCableLength: '600', threeBracedCableLength: '380', cableClampCount: '16', cableLength: '980', cableType: 'Single Mode G.652D', details: 'Tower installation floors 5-10.', submittedAt: '2026-05-26T11:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'CR007', jobId: 'J011', submittedById: 'u2', clientName: 'Aisha Al-Subaie', address: '78 Khalidiyah, Abu Dhabi', doubleBracedCableLength: '180', threeBracedCableLength: '90', cableClampCount: '6', cableLength: '270', cableType: 'Single Mode G.657A', details: 'Shared corridor, bend-insensitive fiber used.', submittedAt: '2026-05-27T09:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'CR008', jobId: 'J012', submittedById: 'u2', clientName: 'Majed Al-Harbi', address: '4 Jumeirah, Dubai', doubleBracedCableLength: '120', threeBracedCableLength: '60', cableClampCount: '4', cableLength: '180', cableType: 'Single Mode G.657A', details: 'Garden conduit run. UV-protected cable used.', submittedAt: '2026-05-28T10:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'CR009', jobId: 'J013', submittedById: 'u2', clientName: 'Badr Al-Rashidi', address: '91 Al-Quoz, Dubai', doubleBracedCableLength: '500', threeBracedCableLength: '250', cableClampCount: '14', cableLength: '750', cableType: 'Single Mode G.652D', details: 'Industrial unit. Armored cable used.', submittedAt: '2026-05-20T10:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'CR010', jobId: 'J014', submittedById: 'u2', clientName: 'Dina Al-Saud', address: '34 Al-Barsha, Dubai', doubleBracedCableLength: '950', threeBracedCableLength: '500', cableClampCount: '28', cableLength: '1450', cableType: 'Multi Mode OM3', details: 'Large apartment complex. Riser system installed.', submittedAt: '2026-05-21T11:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'CR011', jobId: 'J015', submittedById: 'u2', clientName: 'Fahad Al-Malik', address: '17 Al-Ain Downtown', doubleBracedCableLength: '200', threeBracedCableLength: '120', cableClampCount: '8', cableLength: '320', cableType: 'Single Mode G.652D', details: 'Smart home pre-wired.', submittedAt: '2026-05-22T09:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'CR012', jobId: 'J016', submittedById: 'u2', clientName: 'Hind Al-Zahrani', address: '62 Al-Matar, Riyadh', doubleBracedCableLength: '600', threeBracedCableLength: '320', cableClampCount: '20', cableLength: '920', cableType: 'Single Mode G.652D', details: 'Government facility. Tamper-evident conduit.', submittedAt: '2026-05-23T10:00:00Z', status: 'approved', reviewNote: '' },
];

export const MOCK_FUSION_REPORTS: FusionReport[] = [
  {
    id: 'FR001', jobId: 'J009', submittedById: 'u3',
    clientName: 'Layla Al-Yami', address: '56 Muaither, Doha',
    atbCount: '1', pigtailCount: '8', adaptorCount: '4', doubleAdaptorCount: '0', tb8Count: '1', tb4Count: '0', splitterCount: '0', cableClampCount: '4',
    pigtails: '8', adaptors: '4', atb: 'ATB-24', tb: 'TB-1',
    details: 'All 8 pigtails fusion spliced with avg. loss < 0.1 dB. OTDR tested and passed.',
    submittedAt: '2026-06-01T12:00:00Z', status: 'pending', reviewNote: '',
  },
  {
    id: 'FR002', jobId: 'J010', submittedById: 'u3',
    clientName: 'Rayan Al-Shehri', address: '22 West Bay, Doha',
    atbCount: '1', pigtailCount: '12', adaptorCount: '6', doubleAdaptorCount: '2', tb8Count: '2', tb4Count: '0', splitterCount: '1', cableClampCount: '8',
    pigtails: '12', adaptors: '6', atb: 'ATB-48', tb: 'TB-2',
    details: 'Tower fusion complete. All 12 splices tested. Loss readings attached.',
    submittedAt: '2026-06-02T13:00:00Z', status: 'approved', reviewNote: '',
  },
  {
    id: 'FR003', jobId: 'J011', submittedById: 'u3',
    clientName: 'Aisha Al-Subaie', address: '78 Khalidiyah, Abu Dhabi',
    atbCount: '1', pigtailCount: '4', adaptorCount: '2', doubleAdaptorCount: '0', tb8Count: '0', tb4Count: '1', splitterCount: '0', cableClampCount: '2',
    pigtails: '4', adaptors: '2', atb: 'ATB-12', tb: 'TB-1',
    details: 'Compact installation. 4-fiber splice closure used. Loss < 0.08 dB per splice.',
    submittedAt: '2026-06-03T14:00:00Z', status: 'approved', reviewNote: '',
  },
  {
    id: 'FR004', jobId: 'J012', submittedById: 'u3',
    clientName: 'Majed Al-Harbi', address: '4 Jumeirah, Dubai',
    atbCount: '2', pigtailCount: '16', adaptorCount: '8', doubleAdaptorCount: '4', tb8Count: '2', tb4Count: '1', splitterCount: '2', cableClampCount: '12',
    pigtails: '16', adaptors: '8', atb: 'ATB-96', tb: 'TB-3',
    details: 'Large villa installation. All 16 pigtails installed. Outdoor-rated splice enclosure.',
    submittedAt: '2026-06-04T15:00:00Z', status: 'pending', reviewNote: '',
  },
  { id: 'FR005', jobId: 'J013', submittedById: 'u3', clientName: 'Badr Al-Rashidi', address: '91 Al-Quoz, Dubai', atbCount: '1', pigtailCount: '8', adaptorCount: '4', doubleAdaptorCount: '0', tb8Count: '1', tb4Count: '0', splitterCount: '0', cableClampCount: '6', pigtails: '8', adaptors: '4', atb: 'ATB-24', tb: 'TB-1', details: 'Industrial splice complete. IP67 enclosure installed.', submittedAt: '2026-05-28T10:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'FR006', jobId: 'J014', submittedById: 'u3', clientName: 'Dina Al-Saud', address: '34 Al-Barsha, Dubai', atbCount: '2', pigtailCount: '24', adaptorCount: '12', doubleAdaptorCount: '6', tb8Count: '4', tb4Count: '2', splitterCount: '3', cableClampCount: '18', pigtails: '24', adaptors: '12', atb: 'ATB-96', tb: 'TB-4', details: 'Full apartment complex fusion. 24 endpoints, all tested.', submittedAt: '2026-05-29T11:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'FR007', jobId: 'J015', submittedById: 'u3', clientName: 'Fahad Al-Malik', address: '17 Al-Ain Downtown', atbCount: '1', pigtailCount: '4', adaptorCount: '2', doubleAdaptorCount: '0', tb8Count: '0', tb4Count: '1', splitterCount: '0', cableClampCount: '3', pigtails: '4', adaptors: '2', atb: 'ATB-12', tb: 'TB-1', details: 'Smart home fusion done. Clean install.', submittedAt: '2026-05-30T09:00:00Z', status: 'approved', reviewNote: '' },
  { id: 'FR008', jobId: 'J016', submittedById: 'u3', clientName: 'Hind Al-Zahrani', address: '62 Al-Matar, Riyadh', atbCount: '1', pigtailCount: '12', adaptorCount: '6', doubleAdaptorCount: '2', tb8Count: '2', tb4Count: '1', splitterCount: '1', cableClampCount: '10', pigtails: '12', adaptors: '6', atb: 'ATB-48', tb: 'TB-2', details: 'Government facility fusion. All splices certified.', submittedAt: '2026-05-31T10:00:00Z', status: 'approved', reviewNote: '' },
];
