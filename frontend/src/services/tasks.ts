import api from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';

export const tasksService = {
  create: async (meetingId: number | string, req: CreateTaskRequest): Promise<Task> => {
    const { data } = await api.post<Task>(`/api/meetings/${meetingId}/tasks`, req);
    return data;
  },

  getById: async (taskId: number | string): Promise<Task> => {
    const { data } = await api.get<Task>(`/api/tasks/${taskId}`);
    return data;
  },

  update: async (taskId: number | string, req: UpdateTaskRequest): Promise<Task> => {
    const { data } = await api.put<Task>(`/api/tasks/${taskId}`, req);
    return data;
  },

  updateStatus: async (taskId: number | string, status: string): Promise<Task> => {
    const { data } = await api.patch<Task>(`/api/tasks/${taskId}/status`, { status });
    return data;
  },

  delete: async (taskId: number | string): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },
};
