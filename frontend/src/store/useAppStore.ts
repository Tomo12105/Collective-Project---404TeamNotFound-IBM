import { create } from 'zustand';
import { MeetingListItem, MeetingFilters } from '@/types';

interface AppState {
  meetings:  MeetingListItem[];
  loading:   boolean;
  theme:     'light' | 'dark';
  username:  string | null;

  setMeetings:   (meetings: MeetingListItem[]) => void;
  addMeeting:    (meeting: MeetingListItem) => void;
  removeMeeting: (id: number) => void;
  setLoading:    (v: boolean) => void;
  setTheme:      (t: 'light' | 'dark') => void;
  setUsername:   (u: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  meetings: [],
  loading:  false,
  theme:    'light',
  username: null,

  setMeetings:   (meetings) => set({ meetings }),
  addMeeting:    (meeting)  => set((s) => ({ meetings: [meeting, ...s.meetings] })),
  removeMeeting: (id)       => set((s) => ({ meetings: s.meetings.filter((m) => m.id !== id) })),
  setLoading:    (v)        => set({ loading: v }),
  setTheme:      (t)        => set({ theme: t }),
  setUsername:   (u)        => set({ username: u }),
}));
