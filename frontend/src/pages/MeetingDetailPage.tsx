import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';
import { meetingsService } from '@/services/meetings';
import { tasksService } from '@/services/tasks';
import { Meeting, Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import StatusBadge from '@/components/atoms/StatusBadge';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TranscriptSection from '@/components/organisms/TranscriptSection';
import ProcessingSection from '@/components/organisms/ProcessingSection';
import AttendeeSection from '@/components/organisms/AttendeeSection';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Tab = 'transcript' | 'attendees' | 'ai' | 'tasks';

export default function MeetingDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [meeting,     setMeeting]     = useState<Meeting | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [tab,         setTab]         = useState<Tab>('transcript');
  const [addOpen,     setAddOpen]     = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    meetingsService.getById(id)
      .then(setMeeting)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteTask = async (taskId: number) => {
    try {
      await tasksService.delete(taskId);
      setMeeting((prev) => prev ? { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) } : prev);
      toast.success('Task deleted');
    } catch (err) { toast.error((err as Error).message); }
  };

  const handleToggleStatus = async (task: Task) => {
    const next = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const updated = await tasksService.updateStatus(task.id, next);
      setMeeting((prev) => prev ? {
        ...prev,
        tasks: prev.tasks.map((t) => t.id === task.id ? { ...updated, meetingId: t.meetingId } : t),
      } : prev);
    } catch (err) { toast.error((err as Error).message); }
  };

  const handleTaskAdded   = (task: Task) =>
    setMeeting((prev) => prev ? { ...prev, tasks: [...prev.tasks, task] } : prev);

  const handleTaskUpdated = (updated: Task) => {
    setMeeting((prev) => prev ? {
      ...prev,
      tasks: prev.tasks.map((t) => t.id === updated.id ? { ...updated, meetingId: t.meetingId } : t),
    } : prev);
    setEditingTask(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={28} /></div>;
  if (error || !meeting) return (
    <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
      <p className="text-[var(--text-sm)] text-[var(--color-error)]">{error || 'Meeting not found.'}</p>
      <Button variant="secondary" size="sm" onClick={() => navigate('/meetings')}>Back</Button>
    </div>
  );

  const openTasks = meeting.tasks.filter((t) => t.status !== 'COMPLETED');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'transcript', label: 'Transcript' },
    { key: 'attendees',  label: 'Attendees' },
    { key: 'ai',         label: 'AI Results' },
    { key: 'tasks',      label: `Tasks (${meeting.tasks.length})` },
  ];

  return (
    <div className="px-4 md:px-6 py-6" style={{ maxWidth: 'var(--content-default)', margin: '0 auto' }}>
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />}
        onClick={() => navigate('/meetings')} className="mb-4">
        All Meetings
      </Button>

      <div className="mb-6">
        <h1 className="text-[var(--text-xl)] font-bold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}>
          {meeting.title}
        </h1>
        <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mt-1">
          by {meeting.uploadedBy.username}
          {meeting.tasks.length > 0 && ` · ${openTasks.length} open task${openTasks.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="flex border-b border-[var(--color-divider)] mb-6 overflow-x-auto" role="tablist">
        {tabs.map(({ key, label }) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
            className={[
              'px-4 py-2.5 text-[var(--text-sm)] font-medium border-b-2 -mb-px transition-all duration-[180ms] whitespace-nowrap',
              tab === key
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            ].join(' ')}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'transcript' && (
        <TranscriptSection
          meetingId={meeting.id}
          transcript={meeting.transcript}
          onUpdate={(t) => setMeeting((prev) => prev ? { ...prev, transcript: t } : prev)}
        />
      )}

      {tab === 'attendees' && <AttendeeSection meetingId={meeting.id} />}

      {tab === 'ai' && (
        <ProcessingSection
          meetingId={meeting.id}
          hasTranscript={!!meeting.transcript?.trim()}
        />
      )}

      {tab === 'tasks' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">Tasks</h3>
            <Button variant="ghost" size="sm" leftIcon={<Plus size={13} />}
              onClick={() => { setAddOpen(!addOpen); setEditingTask(null); }}>Add</Button>
          </div>

          {addOpen && (
            <AddTaskForm
              meetingId={meeting.id}
              onAdded={(t) => { handleTaskAdded(t); setAddOpen(false); }}
              onCancel={() => setAddOpen(false)}
            />
          )}

          {meeting.tasks.length === 0 && !addOpen && (
            <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] py-6 text-center">No tasks yet.</p>
          )}

          {(['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => {
            const group = meeting.tasks.filter((t) => t.status === status);
            if (group.length === 0) return null;
            const labels = { PENDING: 'Pending', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };
            return (
              <div key={status} className="mb-4">
                <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-faint)] mb-1 px-1">
                  {labels[status]} · {group.length}
                </p>
                <div className="flex flex-col gap-1">
                  {group.map((task) => (
                    editingTask?.id === task.id ? (
                      <EditTaskForm key={task.id} task={task}
                        onUpdated={handleTaskUpdated} onCancel={() => setEditingTask(null)} />
                    ) : (
                      <TaskRow key={task.id} task={task}
                        onToggle={handleToggleStatus}
                        onDelete={handleDeleteTask}
                        onEdit={() => { setEditingTask(task); setAddOpen(false); }} />
                    )
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete, onEdit }: {
  task: Task; onToggle: (t: Task) => void; onDelete: (id: number) => void; onEdit: () => void;
}) {
  const isOverdue = task.deadline && task.status !== 'COMPLETED' && new Date(task.deadline) < new Date();
  return (
    <div className="group flex items-start gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-offset)] transition-colors duration-[180ms]">
      <button onClick={() => onToggle(task)} aria-label="Toggle status"
        className={['mt-0.5 w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 transition-all duration-[180ms]',
          task.status === 'COMPLETED' ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]',
        ].join(' ')}>
        {task.status === 'COMPLETED' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      </button>
      <div className="flex-1 min-w-0">
        <p className={['text-[var(--text-sm)] leading-snug', task.status === 'COMPLETED' ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'].join(' ')}>
          {task.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <StatusBadge status={task.status} />
          {task.deadline && (
            <span className={['text-[var(--text-xs)]', isOverdue ? 'text-[var(--color-error)] font-medium' : 'text-[var(--color-text-muted)]'].join(' ')}>
              {isOverdue ? '⚠ Overdue · ' : 'Due: '}{task.deadline}
            </span>
          )}
          {task.assignee && <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">→ {task.assignee.username}</span>}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-all duration-[180ms]">
        <button onClick={onEdit} aria-label="Edit task"
          className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dynamic)] hover:text-[var(--color-text)] transition-all duration-[180ms]">
          <Pencil size={13} />
        </button>
        <button onClick={() => onDelete(task.id)} aria-label="Delete task"
          className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-error-highlight)] hover:text-[var(--color-error)] transition-all duration-[180ms]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function EditTaskForm({ task, onUpdated, onCancel }: { task: Task; onUpdated: (t: Task) => void; onCancel: () => void; }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateTaskRequest>({
    defaultValues: { description: task.description, status: task.status, deadline: task.deadline ?? '' },
    mode: 'onSubmit',
  });
  const onSubmit = async (data: UpdateTaskRequest) => {
    setSaving(true);
    try {
      const updated = await tasksService.update(task.id, { description: data.description, status: data.status || task.status, deadline: data.deadline || undefined });
      toast.success('Task updated');
      onUpdated(updated);
    } catch (err) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-2 p-3 bg-[var(--color-primary-highlight)] border border-[var(--color-border)] rounded-[var(--radius-lg)] flex flex-col gap-2" noValidate>
      <Input placeholder="Task description *" error={errors.description?.message} {...register('description', { required: 'Required' })} />
      <div className="grid grid-cols-2 gap-2">
        <Input type="date" {...register('deadline')} />
        <Select {...register('status')} options={[
          { value: 'PENDING', label: 'Pending' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'COMPLETED', label: 'Completed' },
        ]} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" loading={saving}>Save Changes</Button>
      </div>
    </form>
  );
}

function AddTaskForm({ meetingId, onAdded, onCancel }: { meetingId: number; onAdded: (t: Task) => void; onCancel: () => void; }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTaskRequest>({ mode: 'onSubmit' });
  const onSubmit = async (data: CreateTaskRequest) => {
    setSaving(true);
    try {
      const task = await tasksService.create(meetingId, { ...data, status: data.status || 'PENDING' });
      toast.success('Task added');
      onAdded(task);
    } catch (err) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4 p-3 bg-[var(--color-surface-offset)] rounded-[var(--radius-lg)] flex flex-col gap-2" noValidate>
      <Input placeholder="Task description *" error={errors.description?.message} {...register('description', { required: 'Required' })} />
      <div className="grid grid-cols-2 gap-2">
        <Input type="date" {...register('deadline')} />
        <Select {...register('status')} options={[
          { value: 'PENDING', label: 'Pending' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'COMPLETED', label: 'Completed' },
        ]} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" loading={saving}>Add Task</Button>
      </div>
    </form>
  );
}