import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, ExternalLink } from 'lucide-react';
import { ActionItem, ActionItemStatus } from '@/types';
import { actionItemsService } from '@/services/actionItems';
import { meetingsService } from '@/services/meetings';
import { Meeting } from '@/types';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';
import ActionItemRow from '@/components/molecules/ActionItemRow';
import { ActionItemSkeleton } from '@/components/atoms/Skeleton';
import toast from 'react-hot-toast';

export default function ActionItemsPage() {
  const navigate  = useNavigate();
  const [items,    setItems]    = useState<ActionItem[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading,  setLoading]  = useState(false);

  const [search,         setSearch]         = useState('');
  const [filterStatus,   setFilterStatus]   = useState<ActionItemStatus | 'ALL'>('ALL');
  const [filterAssignee, setFilterAssignee] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const mtgs = await meetingsService.getAll();
        setMeetings(mtgs);
        // fetch action items for all completed meetings
        const completed = mtgs.filter((m) => m.processingStatus === 'COMPLETED');
        const results = await Promise.allSettled(
          completed.map((m) => actionItemsService.getByMeeting(m.id))
        );
        const allItems = results
          .filter((r): r is PromiseFulfilledResult<ActionItem[]> => r.status === 'fulfilled')
          .flatMap((r) => r.value);
        setItems(allItems);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const assigneeOptions = useMemo(() => {
    const names = [...new Set(items.map((i) => i.assignedTo).filter(Boolean))] as string[];
    return [{ value: 'ALL', label: 'All assignees' }, ...names.map((n) => ({ value: n, label: n }))];
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.description.toLowerCase().includes(q) || (i.assignedTo ?? '').toLowerCase().includes(q));
    }
    if (filterStatus !== 'ALL') list = list.filter((i) => i.status === filterStatus);
    if (filterAssignee !== 'ALL') list = list.filter((i) => i.assignedTo === filterAssignee);
    return list;
  }, [items, search, filterStatus, filterAssignee]);

  const getMeetingTitle = (meetingId?: string) =>
    meetings.find((m) => m.id === meetingId)?.title ?? 'Unknown meeting';

  const handleEdit = async (id: string, data: Partial<ActionItem>) => {
    const item = items.find((i) => i.id === id);
    if (!item?.meetingId) return;
    const updated = await actionItemsService.update(item.meetingId, id, data);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    toast.success('Saved');
  };

  const handleDelete = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item?.meetingId) return;
    await actionItemsService.remove(item.meetingId, id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success('Deleted');
  };

  const handleToggle = async (item: ActionItem) => {
    if (!item.meetingId) return item;
    const next = item.status === 'DONE' ? 'OPEN' : 'DONE';
    const updated = await actionItemsService.update(item.meetingId, item.id, { status: next });
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    return updated;
  };

  return (
    <div className="px-4 md:px-6 py-6" style={{ maxWidth: 'var(--content-default)', margin: '0 auto' }}>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-[var(--text-xl)] font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}>
            Action Items
          </h1>
          {!loading && (
            <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mt-0.5">
              {filtered.filter((i) => i.status !== 'DONE').length} open
              {' · '}
              {filtered.length} total
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search action items…" className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ActionItemStatus | 'ALL')}
            options={[
              { value: 'ALL',        label: 'All statuses' },
              { value: 'OPEN',       label: 'Open' },
              { value: 'INPROGRESS', label: 'In Progress' },
              { value: 'DONE',       label: 'Done' },
              { value: 'UNKNOWN',    label: 'Unknown' },
            ]}
            className="text-[var(--text-xs)] py-1.5"
          />
          {assigneeOptions.length > 1 && (
            <Select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              options={assigneeOptions}
              className="text-[var(--text-xs)] py-1.5"
            />
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => <ActionItemSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <CheckSquare size={36} className="text-[var(--color-text-faint)]" />
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
            {items.length === 0 ? 'No action items yet — process some transcripts first.' : 'No items match your filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden divide-y divide-[var(--color-divider)]">
          {filtered.map((item) => (
            <div key={item.id}>
              {item.meetingId && (
                <div className="flex items-center justify-between px-3 pt-2 pb-0">
                  <span className="text-[var(--text-xs)] text-[var(--color-text-faint)] truncate">
                    {getMeetingTitle(item.meetingId)}
                  </span>
                  <button
                    onClick={() => navigate(`/meetings/${item.meetingId}?tab=actions`)}
                    aria-label="View meeting"
                    className="p-1 text-[var(--color-text-faint)] hover:text-[var(--color-primary)] transition-colors duration-[180ms]"
                  >
                    <ExternalLink size={11} />
                  </button>
                </div>
              )}
              <ActionItemRow
                item={item}
                attendees={[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
