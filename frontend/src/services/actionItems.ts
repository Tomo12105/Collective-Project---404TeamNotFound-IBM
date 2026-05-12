import api from './api';
import { ActionItem, AIResults } from '@/types';

export const actionItemsService = {
  getByMeeting: async (meetingId: string): Promise<ActionItem[]> => {
    const { data } = await api.get<ActionItem[]>(`/meetings/${meetingId}/action-items`);
    return data;
  },

  getAIResults: async (meetingId: string): Promise<AIResults> => {
    const { data } = await api.get<AIResults>(`/meetings/${meetingId}/results`);
    return data;
  },

  update: async (meetingId: string, itemId: string, payload: Partial<ActionItem>): Promise<ActionItem> => {
    const { data } = await api.put<ActionItem>(`/meetings/${meetingId}/action-items/${itemId}`, payload);
    return data;
  },

  remove: async (meetingId: string, itemId: string): Promise<void> => {
    await api.delete(`/meetings/${meetingId}/action-items/${itemId}`);
  },
};
