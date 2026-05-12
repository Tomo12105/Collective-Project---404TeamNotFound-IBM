import { useState, useCallback } from 'react';
import { Meeting, Attendee, Transcript, AIResults, UpdateMeetingInput } from '@/types';
import { meetingsService } from '@/services/meetings';
import { attendeesService } from '@/services/attendees';
import { transcriptsService } from '@/services/transcripts';
import { actionItemsService } from '@/services/actionItems';
import { useAppStore } from '@/store/useAppStore';

export function useMeetingDetail(meetingId: string) {
  const { updateMeeting } = useAppStore();

  const [meeting, setMeeting]       = useState<Meeting | null>(null);
  const [attendees, setAttendees]   = useState<Attendee[]>([]);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [aiResults, setAiResults]   = useState<AIResults | null>(null);

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // ---- fetch all detail data ----
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mtg, atts] = await Promise.all([
        meetingsService.getById(meetingId),
        attendeesService.getByMeeting(meetingId),
      ]);
      setMeeting(mtg);
      setAttendees(atts);

      // transcript & results: non-fatal if 404
      try {
        const t = await transcriptsService.getByMeeting(meetingId);
        setTranscript(t);
      } catch { /* no transcript yet */ }

      if (mtg.processingStatus === 'COMPLETED') {
        try {
          const r = await actionItemsService.getAIResults(meetingId);
          setAiResults(r);
        } catch { /* no results yet */ }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  // ---- edit meeting ----
  const editMeeting = useCallback(async (input: UpdateMeetingInput) => {
    const updated = await meetingsService.update(meetingId, input);
    setMeeting(updated);
    updateMeeting(updated);
    return updated;
  }, [meetingId, updateMeeting]);

  // ---- attendees ----
  const addAttendee = useCallback(async (payload: { name: string; email?: string; role?: string }) => {
    const att = await attendeesService.add(meetingId, payload);
    setAttendees((prev) => [...prev, att]);
    return att;
  }, [meetingId]);

  const editAttendee = useCallback(async (attendeeId: string, payload: Partial<{ name: string; email?: string; role?: string }>) => {
    const att = await attendeesService.update(meetingId, attendeeId, payload);
    setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? att : a)));
    return att;
  }, [meetingId]);

  const removeAttendee = useCallback(async (attendeeId: string) => {
    await attendeesService.remove(meetingId, attendeeId);
    setAttendees((prev) => prev.filter((a) => a.id !== attendeeId));
  }, [meetingId]);

  // ---- transcript ----
  const uploadTranscript = useCallback(async (file: File) => {
    const t = await transcriptsService.upload(meetingId, file);
    setTranscript(t);
    return t;
  }, [meetingId]);

  // ---- AI processing ----
  const triggerProcessing = useCallback(async () => {
    await transcriptsService.triggerProcessing(meetingId);
    setMeeting((prev) => prev ? { ...prev, processingStatus: 'PROCESSING' } : prev);
  }, [meetingId]);

  const refreshProcessingStatus = useCallback(async () => {
    const mtg = await meetingsService.getById(meetingId);
    setMeeting(mtg);
    updateMeeting(mtg);
    if (mtg.processingStatus === 'COMPLETED') {
      try {
        const r = await actionItemsService.getAIResults(meetingId);
        setAiResults(r);
      } catch { /* no results yet */ }
    }
    return mtg;
  }, [meetingId, updateMeeting]);

  return {
    meeting, attendees, transcript, aiResults,
    loading, error,
    fetchDetail,
    editMeeting,
    addAttendee, editAttendee, removeAttendee,
    uploadTranscript,
    triggerProcessing,
    refreshProcessingStatus,
    setAiResults,
  };
}
