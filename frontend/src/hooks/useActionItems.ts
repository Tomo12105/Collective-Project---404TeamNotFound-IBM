import { useState, useCallback } from 'react';
import { ActionItem } from '@/types';
import { actionItemsService } from '@/services/actionItems';

export function useActionItems(meetingId: string) {
  const [items,   setItems]   = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await actionItemsService.getByMeeting(meetingId);
      setItems(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  const editItem = useCallback(async (id: string, payload: Partial<ActionItem>) => {
    const updated = await actionItemsService.update(meetingId, id, payload);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, [meetingId]);

  const deleteItem = useCallback(async (id: string) => {
    await actionItemsService.remove(meetingId, id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, [meetingId]);

  const toggleStatus = useCallback(async (item: ActionItem) => {
    const next = item.status === 'DONE' ? 'OPEN' : 'DONE';
    const updated = await actionItemsService.update(meetingId, item.id, { status: next });
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    return updated;
  }, [meetingId]);

  return { items, loading, error, fetchItems, editItem, deleteItem, toggleStatus };
}
