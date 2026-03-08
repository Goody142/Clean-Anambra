export type UserRole = 'resident' | 'pickup_team' | 'government';

export type ReportCategory =
  | 'garbage_heap'
  | 'blocked_drainage'
  | 'delayed_pickup'
  | 'illegal_dumping'
  | 'environmental_hazard'
  | 'emergency_corpse';

export type ReportStatus = 'pending' | 'assigned' | 'in_progress' | 'completed';

export type ReportPriority = 'normal' | 'high' | 'emergency';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  area: string;
  avatar?: string;
}

export interface WasteReport {
  id: string;
  reporterId: string;
  category: ReportCategory;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    area: string;
  };
  imageUrl?: string;
  status: ReportStatus;
  priority: ReportPriority;
  createdAt: string;
  updatedAt: string;
  assignedTeamId?: string;
}

export interface PickupTask {
  id: string;
  reportId: string;
  teamId: string;
  status: ReportStatus;
  acceptedAt?: string;
  completedAt?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'success';
  read: boolean;
  createdAt: string;
  reportId?: string;
}

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  garbage_heap: 'Garbage Heap',
  blocked_drainage: 'Blocked Drainage',
  delayed_pickup: 'Delayed Waste Pickup',
  illegal_dumping: 'Illegal Dumping',
  environmental_hazard: 'Environmental Hazard',
  emergency_corpse: 'Emergency: Unattended Corpse',
};

export const CATEGORY_ICONS: Record<ReportCategory, string> = {
  garbage_heap: '🗑️',
  blocked_drainage: '🚧',
  delayed_pickup: '🚛',
  illegal_dumping: '⚠️',
  environmental_hazard: '☣️',
  emergency_corpse: '🚨',
};
