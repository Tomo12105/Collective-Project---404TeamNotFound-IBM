import { useState, useMemo } from 'react';
import { CheckSquare, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { ActionItem, ActionItemStatus, Attendee } from '@/types';
import ActionItemRow from '@/components/molecules/ActionItemRow';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ConfirmDialog from '@/components/molecules/ConfirmDialog';
import Spinner from '@/components/atoms/Spinner';
import toast from 'react-hot-toast';

const STATUS_ORDER: ActionItemStatus[] = ['OPEN', 'INPROGRESS', 'DONE', 'UNKNOWN'];
const STATUS_LABELS: Record<ActionItemStatus, string> = {
  OPEN: 'Open', INPROGRESS: 'In Progress', DONE: 'Done', UNKNOWN: 'Unknown',
};

interface Props {
  items:     ActionItem[];
  attendees: Attendee[];
  loading:   boolean;
  onEdit:    (id: string, data: Partial<ActionItem>) => Promise<void>;
  onDelete:  (id: string) => Promise<void>;
  onToggle:  (item: ActionItem) => Promise<void>;
}

export default function ActionItemsSection({ items, attendees, loading, onEdit, onDelete, onToggle }: Props) {
  const [filterStatus,   setFilterStatus]   = useState<ActionItemStatus | 'ALL'>('ALL');
  const [filterAssignee, setFilterAssignee] = useState('ALL');
  const [collapsed,      setCollapsed]      = useState<Set<ActionItemStatus>>(new Set());
  const [deletingId,     setDeletingId]     = useState<string | null>(null);
  const [deleteLoading,  setDeleteLoading]  = useState(false);

  const assigneeOptions = useMemo(() => {
    const names = [...new Set(items.map((i) => i.assignedTo).filter(Boolean))] as string[];
    return [{ value: 'ALL', label: 'All assignees' }, ...names.map((n) => ({ value: n, label: n }))];
  }, [items]);

  const filtered = useMemo(() => items.filter((i) => {
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false;
    if (filterAssignee !== 'ALL' && i.assignedTo !== filterAssignee) return false;
    return true;
  }), [items, filterStatus, filterAssignee]);

  const grouped = useMemo(() => {
    const map: Record<ActionItemStatus, ActionItem[]> = { OPEN: [], INPROGRESS: [], DONE: [], UNKNOWN: [] };
    filtered.forEach((i) => { (map[i.status] ?? map.UNKNOWN).push(i); });
    return map;
  }, [filtered]);

  const toggleCollapse = (status: ActionItemStatus) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(status) ? next.delete(status) : next.add(status);
      return next;
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await onDelete(deletingId);
      toast.success('Action item deleted');
      setDeletingId(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckSquare size={15} className="text-[var(--color-text-muted)]" />
          <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">
            Action Items
            {items.length > 0 && (
              <span className="ml-2 text-[var(--text-xs)] text-[var(--color-text-muted)] font-normal">
                ({filtered.length}{filtered.length !== items.length ? ` / ${items.length}` : ''})
              </span>
            )}
          </h3>
        </div>

        {/* Filters */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-[var(--color-text-muted)]" />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ActionItemStatus | 'ALL')}
              options={[
                { value: 'ALL', label: 'All statuses' },
                { value: 'OPEN', label: 'Open' },
                { value: 'INPROGRESS', label: 'In Progress' },
                { value: 'DONE', label: 'Done' },
                { value: 'UNKNOWN', label: 'Unknown' },
              ]}
              className="text-[var(--text-xs)] py-1"
            />
            {assigneeOptions.length > 1 && (
              <Select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                options={assigneeOptions}
                className="text-[var(--text-xs)] py-1"
              />
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-6 justify-center">
          <Spinner size={16} />
          <span className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Loading action items…</span>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="py-10 text-center">
          <CheckSquare size={28} className="mx-auto mb-2 text-[var(--color-text-faint)]" />
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">No action items yet.</p>
          <p className="text-[var(--text-xs)] text-[var(--color-text-faint)] mt-1">They'll appear here after AI processing.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="flex flex-col gap-4">
          {STATUS_ORDER.map((status) => {
            const group = grouped[status];
            if (group.length === 0) return null;
            const isCollapsed = collapsed.has(status);
            return (
              <div key={status} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
                {/* Group header */}
                <button
                  onClick={() => toggleCollapse(status)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[var(--color-surface-offset)] hover:bg-[var(--color-surface-dynamic)] transition-colors duration-[180ms] text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="text-[var(--text-xs)] text-[var(--color-text-muted)] bg-[var(--color-surface-dynamic)] px-1.5 py-0.5 rounded-[var(--radius-full)]">
                      {group.length}
                    </span>
                  </span>
                  {isCollapsed ? <ChevronRight size={14} className="text-[var(--color-text-muted)]" /> : <ChevronDown size={14} className="text-[var(--color-text-muted)]" />}
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="bg-[var(--color-surface)] p-2 flex flex-col gap-0.5">
                    {group.map((item) => (
                      <ActionItemRow
                        key={item.id}
                        item={item}
                        attendees={attendees}
                        onEdit={onEdit}
                        onDelete={(id) => setDeletingId(id)}
                        onToggle={onToggle}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingId}
        title="Delete action item"
        message="This action item will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
        loading={deleteLoading}
      />
    </section>
  );
}
