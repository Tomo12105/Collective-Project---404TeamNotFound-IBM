import api from './api';
import { Attendee, CreateAttendeeInput } from '@/types';

export const attendeesService = {
  getAll: async (meetingId: number): Promise<Attendee[]> => {
    const { data } = await api.get<Attendee[]>(`/api/meetings/${meetingId}/attendees`);
    return data;
  },
  create: async (meetingId: number, input: CreateAttendeeInput): Promise<Attendee> => {
    const { data } = await api.post<Attendee>(`/api/meetings/${meetingId}/attendees`, input);
    return data;
  },
  update: async (meetingId: number, attendeeId: number, input: Partial<CreateAttendeeInput>): Promise<Attendee> => {
    const { data } = await api.put<Attendee>(`/api/meetings/${meetingId}/attendees/${attendeeId}`, input);
    return data;
  },
  delete: async (meetingId: number, attendeeId: number): Promise<void> => {
    await api.delete(`/api/meetings/${meetingId}/attendees/${attendeeId}`);
  },
};