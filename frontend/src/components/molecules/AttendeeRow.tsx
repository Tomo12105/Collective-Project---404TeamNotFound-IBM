import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Attendee } from '@/types';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

interface Props {
  attendee: Attendee;
  onEdit: (id: string, data: Partial<Attendee>) => Promise<void>;
  onRemove: (id: string) => void;
}

export default function AttendeeRow({ attendee, onEdit, onRemove }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: attendee.name, email: attendee.email || '', role: attendee.role || '' },
  });

  const onSubmit = async (data: { name: string; email: string; role: string }) => {
    setSaving(true);
    try {
      await onEdit(attendee.id, { name: data.name, email: data.email || undefined, role: data.role || undefined });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    reset({ name: attendee.name, email: attendee.email || '', role: attendee.role || '' });
    setEditing(false);
  };

  if (editing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 py-2 px-3 bg-[var(--color-surface-offset)] rounded-[var(--radius-md)]">
        <div className="flex-1 grid grid-cols-3 gap-2">
          <Input placeholder="Name *" {...register('name', { required: true })} className="h-7 text-[var(--text-xs)]" />
          <Input placeholder="Email"  {...register('email')}                    className="h-7 text-[var(--text-xs)]" />
          <Input placeholder="Role"   {...register('role')}                     className="h-7 text-[var(--text-xs)]" />
        </div>
        <Button type="submit" size="sm" loading={saving} className="h-7 px-2">
          <Check size={13} />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleCancel} className="h-7 px-2">
          <X size={13} />
        </Button>
      </form>
    );
  }

  return (
    <div className="group flex items-center gap-3 py-2.5 px-3 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-offset)] transition-colors duration-[180ms]">
      {/* Avatar initial */}
      <div className="w-7 h-7 rounded-[var(--radius-full)] bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center text-[var(--text-xs)] font-semibold shrink-0">
        {attendee.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)] truncate">{attendee.name}</p>
        {(attendee.email || attendee.role) && (
          <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate">
            {[attendee.email, attendee.role].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-[180ms]">
        <button
          onClick={() => setEditing(true)}
          aria-label="Edit attendee"
          className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dynamic)] hover:text-[var(--color-text)] transition-colors duration-[180ms]"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onRemove(attendee.id)}
          aria-label="Remove attendee"
          className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-error-highlight)] hover:text-[var(--color-error)] transition-colors duration-[180ms]"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
