import api from './api';
import { Meeting, MeetingListItem, CreateMeetingInput } from '@/types';

export const meetingsService = {
  getAll: async (): Promise<MeetingListItem[]> => {
    const { data } = await api.get<MeetingListItem[]>('/api/meetings');
    return data;
  },

  getById: async (id: number | string): Promise<Meeting> => {
    const { data } = await api.get<Meeting>(`/api/meetings/${id}`);
    return data;
  },

  create: async (input: CreateMeetingInput): Promise<Meeting> => {
    const { data } = await api.post<Meeting>('/api/meetings', input);
    return data;
  },

  update: async (id: number | string, input: Partial<CreateMeetingInput>): Promise<Meeting> => {
    const { data } = await api.put<Meeting>(`/api/meetings/${id}`, input);
    return data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/api/meetings/${id}`);
  },
};