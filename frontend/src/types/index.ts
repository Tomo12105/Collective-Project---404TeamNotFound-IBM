// ─── Auth ───────────────────────────────────────────────────────────────────
export interface LoginRequest    { username: string; password: string; }
export interface RegisterRequest { username: string; password: string; }
export interface AuthResponse    { token: string; username: string; role: string; }

// ─── Meeting ────────────────────────────────────────────────────────────────
export interface UploadedBy { id: number; username: string; }

export interface Meeting {
  id:          number;
  title:       string;
  transcript:  string;
  uploadedBy:  UploadedBy;
  tasks:       Task[];
  attendees?:  Attendee[];
}

export interface MeetingListItem {
  id:         number;
  title:      string;
  uploadedBy: UploadedBy;
}

export interface CreateMeetingInput {
  title:      string;
  transcript: string;
}

// ─── Attendee ───────────────────────────────────────────────────────────────
export interface Attendee {
  id:     number;
  name:   string;
  email?: string;
  role?:  string;
}

export interface CreateAttendeeInput {
  name:   string;
  email?: string;
  role?:  string;
}

// ─── Task (Action Item) ─────────────────────────────────────────────────────
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type ActionItemStatus = TaskStatus;

export interface TaskAssignee { id: number; username: string; }

export interface Task {
  id:          number;
  description: string;
  status:      TaskStatus;
  deadline?:   string;
  meetingId:   number;
  assignee?:   TaskAssignee;
}

export type ActionItem = Task & { assignedTo?: string; dueDate?: string; };

export interface CreateTaskRequest {
  description: string;
  deadline?:   string;
  status?:     TaskStatus;
}

export interface UpdateTaskRequest {
  description:     string;
  status?:         string;
  deadline?:       string;
  assigneeUserId?: number;
}

// ─── AI Results ─────────────────────────────────────────────────────────────
export interface AIResult {
  summary?:         string;
  detailedNotes?:   string;
  decisions?:       string;
  followUpNotes?:   string;
  processingStatus?: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

// ─── Filters / Store ────────────────────────────────────────────────────────
export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface MeetingFilters {
  search:    string;
  sortBy:    'title' | 'id';
  sortOrder: 'asc' | 'desc';
}