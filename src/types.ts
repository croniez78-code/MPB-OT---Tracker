export interface OvertimeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // in hours, e.g. 3.5
  project: string;
  notes: string;
}

export interface StaffMember {
  id: string;
  name: string;
  department: string;
  role: string;
  status: 'Submitted' | 'Pending';
  submittedAt: string | null;
  avatar: string;
  img?: string;
  imgAlt?: string;
  entries: OvertimeEntry[];
}

export type UserRole = 'staff' | 'admin';

export type SimulatedTimeline = '3' | '7' | '9' | '14';

export type ActiveView =
  | 'staff-dashboard'
  | 'claim-review'
  | 'admin-monitoring'
  | 'reports'
  | 'staff-directory'
  | 'login';

export type AppLanguage = 'en' | 'bm';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  icon?: string;
}

export interface AuthSession {
  isLoggedIn: boolean;
  role: UserRole;
  userName: string;
  userEmail?: string;
  department?: string;
  staffId?: string;
}


