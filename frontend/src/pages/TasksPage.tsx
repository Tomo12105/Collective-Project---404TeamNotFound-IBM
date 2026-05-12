import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, ExternalLink } from 'lucide-react';
import { Task, TaskStatus, MeetingListItem } from '@/types';
import { meetingsService } from '@/services/meetings';
import { tasksService } from '@/services/tasks';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';
import StatusBadge from '@/components/atoms/StatusBadge';
import { ActionItemSkeleton } from '@/components/atoms/Skeleton';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const navigate  = useNavigate();
  const [tasks,    setTasks]    = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [search,   setSearch]   = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const mtgs = await meetingsService.getAll();
        setMeetings(mtgs);
        const results = await Promise.allSettled(
          mtgs.map((m) =>
            meetingsService.getById(m.id).then((full) =>
              (full.tasks ?? []).map((t) => ({ ...t, meetingId: m.id }))
            )
          )
        );
        const all = results
          .filter((r): r is PromiseFulfilledResult<Task[]> => r.status === 'fulfilled')
          .flatMap((r) => r.value);
        setTasks(all);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.description.toLowerCase().includes(q));
    }
    if (filterStatus !== 'ALL') list = list.filter((t) => t.status === filterStatus);
    return list;
  }, [tasks, search, filterStatus]);

  const getMeetingTitle = (meetingId: number) =>
    meetings.find((m) => m.id === meetingId)?.title ?? `Meeting #${meetingId}`;

  const handleToggle = async (task: Task) => {
    const next: TaskStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const updated = await tasksService.updateStatus(task.id, next);
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...updated, meetingId: task.meetingId } : t));
    } catch (err) { toast.error((err as Error).message); }
  };

  return (
    <div className="px-4 md:px-6 py-6" style={{ maxWidth: 'var(--content-default)', margin: '0 auto' }}>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-[var(--text-xl)] font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-display)' }}>
            All Tasks
          </h1>
          {!loading && (
            <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mt-0.5">
              {filtered.filter((t) => t.status !== 'COMPLETED').length} open · {filtered.length} total
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks…" className="flex-1" />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'ALL')}
          options={[
            { value: 'ALL',         label: 'All statuses' },
            { value: 'PENDING',     label: 'Pending' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED',   label: 'Completed' },
          ]}
          className="text-[var(--text-xs)] py-1.5"
        />
      </div>

      {loading ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => <ActionItemSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <CheckSquare size={36} className="text-[var(--color-text-faint)]" />
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
            {tasks.length === 0 ? 'No tasks yet.' : 'No tasks match your filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden divide-y divide-[var(--color-divider)]">
          {filtered.map((task) => (
            <div key={task.id} className="group flex items-start gap-3 p-3 hover:bg-[var(--color-surface-offset)] transition-colors duration-[180ms]">
              <button onClick={() => handleToggle(task)} aria-label="Toggle status"
                className={['mt-0.5 w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 transition-all duration-[180ms]',
                  task.status === 'COMPLETED'
                    ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]',
                ].join(' ')}>
                {task.status === 'COMPLETED' && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[var(--text-xs)] text-[var(--color-text-faint)] truncate">
                    {getMeetingTitle(task.meetingId)}
                  </span>
                  <button onClick={() => navigate(`/meetings/${task.meetingId}`)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--color-text-faint)] hover:text-[var(--color-primary)] transition-all duration-[180ms]">
                    <ExternalLink size={11} />
                  </button>
                </div>
                <p className={['text-[var(--text-sm)] leading-snug',
                  task.status === 'COMPLETED'
                    ? 'line-through text-[var(--color-text-muted)]'
                    : 'text-[var(--color-text)]',
                ].join(' ')}>
                  {task.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={task.status} />
                  {task.deadline && (
                    <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">Due: {task.deadline}</span>
                  )}
                  {task.assignee && (
                    <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">→ {task.assignee.username}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}