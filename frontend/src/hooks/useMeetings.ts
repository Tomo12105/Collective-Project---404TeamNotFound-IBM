import { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { meetingsService } from '@/services/meetings';
import { CreateMeetingInput } from '@/types';
import toast from 'react-hot-toast';

export function useMeetings() {
  const { setMeetings, addMeeting, removeMeeting, setLoading } = useAppStore();

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await meetingsService.getAll();
      setMeetings(data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [setMeetings, setLoading]);

  const createMeeting = useCallback(async (input: CreateMeetingInput) => {
    const meeting = await meetingsService.create(input);
    addMeeting({ id: meeting.id, title: meeting.title, uploadedBy: meeting.uploadedBy });
    toast.success('Meeting created');
    return meeting;
  }, [addMeeting]);

  const deleteMeeting = useCallback(async (id: number) => {
    await meetingsService.delete(id);
    removeMeeting(id);
    toast.success('Meeting deleted');
  }, [removeMeeting]);

  return { fetchMeetings, createMeeting, deleteMeeting };
}
