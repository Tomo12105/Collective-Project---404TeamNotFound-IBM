import api from './api';
import { AIResult } from '@/types';

export const transcriptsService = {
  upload: async (meetingId: number, text: string): Promise<void> => {
    await api.put(`/api/meetings/${meetingId}`, { transcript: text });
  },
  uploadFile: async (meetingId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/api/meetings/${meetingId}/transcript`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  process: async (meetingId: number): Promise<AIResult> => {
    const { data } = await api.post<AIResult>(`/api/meetings/${meetingId}/process`);
    return data;
  },
  getResults: async (meetingId: number): Promise<AIResult> => {
    const { data } = await api.get<AIResult>(`/api/meetings/${meetingId}/results`);
    return data;
  },
};