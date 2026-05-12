import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format, isPast, parseISO } from 'date-fns';
import { Pencil, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { ActionItem, ActionItemStatus, Attendee } from '@/types';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const STATUS_OPTIONS: { value: ActionItemStatus; label: string }[] = [
  { value: 'OPEN',       label: 'Open' },
  { value: 'INPROGRESS', label: 'In Progress' },
  { value: 'DONE',       label: 'Done' },
  { value: 'UNKNOWN',    label: 'Unknown' },
];

interface EditForm {
  description: string;
  assignedTo:  string;
  dueDate:     string;
  status:      ActionItemStatus;
}

interface Props {
  item:      ActionItem;
  attendees: Attendee[];
  onEdit:    (id: string, data: Partial<ActionItem>) => Promise<void>;
  onDelete:  (id: string) => void;
  onToggle:  (item: ActionItem) => Promise<void>;
}

export default function ActionItemRow({ item, attendees, onEdit, onDelete, onToggle }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [toggling, setToggling] = useState(false);

  const isOverdue = item.dueDate && item.status !== 'DONE' && isPast(parseISO(item.dueDate));

  const { register, handleSubmit, reset, control } = useForm<EditForm>({
    defaultValues: {
      description: item.description,
      assignedTo:  item.assignedTo || '',
      dueDate:     item.dueDate ? item.dueDate.slice(0, 10) : '',
      status:      item.status,
    },
  });

  const handleSave = async (data: EditForm) => {
    setSaving(true);
    try {
      await onEdit(item.id, {
        description: data.description,
        assignedTo:  data.assignedTo || undefined,
        dueDate:     data.dueDate || undefined,
        status:      data.status,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(item); }
    finally { setToggling(false); }
  };

  if (editing) {
    return (
      <form
        onSubmit={handleSubmit(handleSave)}
        className="p-3 bg-[var(--color-surface-offset)] rounded-[var(--radius-lg)] flex flex-col gap-2"
      >
        <Input
          placeholder="Description *"
          {...register('description', { required: true })}
          className="text-[var(--text-sm)]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {attendees.length > 0 ? (
            <Controller name="assignedTo" control={control} render={({ field }) => (
              <Select {...field} options={[
                { value: '', label: 'Unassigned' },
                ...attendees.map((a) => ({ value: a.name, label: a.name })),
              ]} />
            )} />
          ) : (
            <Input placeholder="Assigned to" {...register('assignedTo')} />
          )}
          <Input type="date" {...register('dueDate')} />
          <Controller name="status" control={control} render={({ field }) => (
            <Select {...field} options={STATUS_OPTIONS} />
          )} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm"
            onClick={() => { reset(); setEditing(false); }}>
            <X size={13} /> Cancel
          </Button>
          <Button type="submit" size="sm" loading={saving}>
            <Check size={13} /> Save
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className={[
      'group flex items-start gap-3 p-3 rounded-[var(--radius-md)] transition-colors duration-[180ms]',
      isOverdue ? 'bg-[var(--color-warning-highlight)]' : 'hover:bg-[var(--color-surface-offset)]',
    ].join(' ')}>
      {/* Quick-complete toggle */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        aria-label={item.status === 'DONE' ? 'Mark as open' : 'Mark as done'}
        className={[
          'mt-0.5 w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 transition-all duration-[180ms]',
          item.status === 'DONE'
            ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]',
        ].join(' ')}
      >
        {item.status === 'DONE' && <Check size={11} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={[
          'text-[var(--text-sm)] font-medium leading-snug',
          item.status === 'DONE' ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]',
        ].join(' ')}>
          {item.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {item.assignedTo && (
            <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">→ {item.assignedTo}</span>
          )}
          {item.dueDate && (
            <span className={[
              'flex items-center gap-1 text-[var(--text-xs)]',
              isOverdue ? 'text-[var(--color-warning)] font-medium' : 'text-[var(--color-text-muted)]',
            ].join(' ')}>
              {isOverdue && <AlertTriangle size={10} />}
              {format(parseISO(item.dueDate), 'MMM d, yyyy')}
            </span>
          )}
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-[180ms] shrink-0">
        <button
          onClick={() => setEditing(true)}
          aria-label="Edit action item"
          className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dynamic)] hover:text-[var(--color-text)] transition-colors duration-[180ms]"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          aria-label="Delete action item"
          className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-error-highlight)] hover:text-[var(--color-error)] transition-colors duration-[180ms]"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
