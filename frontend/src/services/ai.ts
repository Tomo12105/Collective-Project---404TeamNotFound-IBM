import api from './api';
import { AIResult } from '@/types';

export const aiService = {
  process: async (meetingId: number | string): Promise<AIResult> => {
    const { data } = await api.post<AIResult>(`/api/meetings/${meetingId}/process`);
    return data;
  },

  getResults: async (meetingId: number | string): Promise<AIResult> => {
    const { data } = await api.get<AIResult>(`/api/meetings/${meetingId}/results`);
    return data;
  },
};