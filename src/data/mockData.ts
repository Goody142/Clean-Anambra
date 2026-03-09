import { User, WasteReport, PickupTask, Notification } from './types';

export const initialUsers: User[] = [
  { id: 'u1', name: 'Chidinma Obianigwe', role: 'resident', phone: '08012345678', area: 'Upper Iweka, Onitsha' },
  { id: 'u2', name: 'Emeka Nwankwo', role: 'resident', phone: '08023456789', area: 'Fegge, Onitsha' },
  { id: 'u3', name: 'Adaeze Eze', role: 'resident', phone: '08034567890', area: 'Awka Road, Onitsha' },
  { id: 'u4', name: 'Team Alpha Sanitation', role: 'pickup_team', phone: '08045678901', area: 'Onitsha Central' },
  { id: 'u5', name: 'Team Beta Cleanup', role: 'pickup_team', phone: '08056789012', area: 'Onitsha North' },
  { id: 'u6', name: 'ASWAMA Supervisor', role: 'government', phone: '08067890123', area: 'Anambra State' },
];

export const initialReports: WasteReport[] = [
  {
    id: 'r1', reporterId: 'u1', category: 'garbage_heap',
    description: 'Large pile of refuse accumulating beside the main drainage for over a week.',
    location: { address: '12 Iweka Road, Onitsha', lat: 6.1453, lng: 6.7876, area: 'Upper Iweka' },
    status: 'pending', priority: 'normal', createdAt: '2026-03-07T08:30:00Z', updatedAt: '2026-03-07T08:30:00Z',
  },
  {
    id: 'r2', reporterId: 'u2', category: 'blocked_drainage',
    description: 'Drainage completely blocked with debris and plastic waste near market junction.',
    location: { address: 'Fegge Market Junction', lat: 6.1390, lng: 6.7850, area: 'Fegge' },
    status: 'assigned', priority: 'high', createdAt: '2026-03-06T14:00:00Z', updatedAt: '2026-03-07T10:00:00Z',
    assignedTeamId: 'u4',
  },
  {
    id: 'r3', reporterId: 'u3', category: 'emergency_corpse',
    description: 'Unattended body discovered on the roadside near Awka Road bridge. Urgent response needed.',
    location: { address: 'Awka Road Bridge, Onitsha', lat: 6.1500, lng: 6.7920, area: 'Awka Road' },
    status: 'pending', priority: 'emergency', createdAt: '2026-03-08T06:15:00Z', updatedAt: '2026-03-08T06:15:00Z',
  },
  {
    id: 'r4', reporterId: 'u1', category: 'delayed_pickup',
    description: 'Trash bags placed outside since Monday. No pickup vehicle has come. Starting to smell.',
    location: { address: '5 New Parts Road, Onitsha', lat: 6.1420, lng: 6.7860, area: 'New Parts' },
    status: 'in_progress', priority: 'normal', createdAt: '2026-03-05T09:00:00Z', updatedAt: '2026-03-07T16:00:00Z',
    assignedTeamId: 'u5',
  },
  {
    id: 'r5', reporterId: 'u2', category: 'illegal_dumping',
    description: 'People dumping waste into the river at night near the bridge.',
    location: { address: 'Niger Bridge Approach, Onitsha', lat: 6.1650, lng: 6.7740, area: 'Bridge Head' },
    status: 'pending', priority: 'high', createdAt: '2026-03-07T22:00:00Z', updatedAt: '2026-03-07T22:00:00Z',
  },
  {
    id: 'r6', reporterId: 'u1', category: 'garbage_heap',
    description: 'Market waste piling up near the bus stop. Rats seen at night.',
    location: { address: 'Main Market Bus Stop, Onitsha', lat: 6.1410, lng: 6.7830, area: 'Main Market' },
    status: 'pending', priority: 'high', createdAt: '2026-03-08T10:00:00Z', updatedAt: '2026-03-08T10:00:00Z',
  },
  {
    id: 'r7', reporterId: 'u3', category: 'blocked_drainage',
    description: 'Storm drain blocked causing flooding during rain.',
    location: { address: 'Ochanja Road, Onitsha', lat: 6.1380, lng: 6.7890, area: 'Ochanja' },
    status: 'completed', priority: 'normal', createdAt: '2026-03-04T07:00:00Z', updatedAt: '2026-03-06T15:00:00Z',
    assignedTeamId: 'u4',
  },
  {
    id: 'r8', reporterId: 'u2', category: 'environmental_hazard',
    description: 'Chemical smell from illegal factory waste dumped in open lot.',
    location: { address: 'Industrial Layout, Nnewi', lat: 6.0200, lng: 6.9100, area: 'Nnewi' },
    status: 'pending', priority: 'high', createdAt: '2026-03-08T14:30:00Z', updatedAt: '2026-03-08T14:30:00Z',
  },
  {
    id: 'r9', reporterId: 'u1', category: 'garbage_heap',
    description: 'Refuse dump blocking pedestrian walkway near school.',
    location: { address: 'Zik Avenue, Awka', lat: 6.2100, lng: 7.0700, area: 'Awka' },
    status: 'assigned', priority: 'normal', createdAt: '2026-03-07T11:00:00Z', updatedAt: '2026-03-08T09:00:00Z',
    assignedTeamId: 'u5',
  },
  {
    id: 'r10', reporterId: 'u3', category: 'delayed_pickup',
    description: 'Scheduled pickup missed for 3 consecutive weeks.',
    location: { address: '12 Iweka Road, Onitsha', lat: 6.1453, lng: 6.7876, area: 'Upper Iweka' },
    status: 'pending', priority: 'normal', createdAt: '2026-03-08T08:00:00Z', updatedAt: '2026-03-08T08:00:00Z',
  },
];

export const initialTasks: PickupTask[] = [
  { id: 't1', reportId: 'r2', teamId: 'u4', status: 'assigned', acceptedAt: '2026-03-07T10:00:00Z' },
  { id: 't2', reportId: 'r4', teamId: 'u5', status: 'in_progress', acceptedAt: '2026-03-07T16:00:00Z' },
];

export const initialNotifications: Notification[] = [
  {
    id: 'n1', userId: 'u4', title: 'New Task Assigned',
    message: 'Blocked drainage report at Fegge Market Junction has been assigned to your team.',
    type: 'info', read: false, createdAt: '2026-03-07T10:00:00Z', reportId: 'r2',
  },
  {
    id: 'n2', userId: 'u6', title: '🚨 Emergency Alert',
    message: 'Unattended corpse reported at Awka Road Bridge. Immediate response required.',
    type: 'emergency', read: false, createdAt: '2026-03-08T06:15:00Z', reportId: 'r3',
  },
  {
    id: 'n3', userId: 'u5', title: 'Task Update',
    message: 'You have accepted the delayed pickup task at New Parts Road.',
    type: 'info', read: true, createdAt: '2026-03-07T16:00:00Z', reportId: 'r4',
  },
  {
    id: 'n4', userId: 'u1', title: 'Report Received',
    message: 'Your garbage heap report at Iweka Road has been received and is awaiting assignment.',
    type: 'info', read: true, createdAt: '2026-03-07T08:31:00Z', reportId: 'r1',
  },
];
