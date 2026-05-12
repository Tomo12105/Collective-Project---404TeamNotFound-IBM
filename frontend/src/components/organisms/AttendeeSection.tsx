import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, UserCircle2 } from 'lucide-react';
import { Attendee, CreateAttendeeInput } from '@/types';
import { attendeesService } from '@/services/attendees';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Spinner from '@/components/atoms/Spinner';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props { meetingId: number; }

export default function AttendeeSection({ meetingId }: Props) {
  const [attendees,   setAttendees]   = useState<Attendee[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [addOpen,     setAddOpen]     = useState(false);
  const [editingId,   setEditingId]   = useState<number | null>(null);
  const [confirmId,   setConfirmId]   = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    attendeesService.getAll(meetingId)
      .then(setAttendees)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [meetingId]);

  const handleAdd = (a: Attendee) => {
    setAttendees((prev) => [...prev, a]);
    setAddOpen(false);
  };

  const handleUpdate = (updated: Attendee) => {
    setAttendees((prev) => prev.map((a) => a.id === updated.id ? updated : a));
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await attendeesService.delete(meetingId, id);
      setAttendees((prev) => prev.filter((a) => a.id !== id));
      toast.success('Attendee removed');
    } catch (err) { toast.error((err as Error).message); }
    setConfirmId(null);
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">
          Attendees {!loading && `(${attendees.length})`}
        </h3>
        <Button variant="ghost" size="sm" leftIcon={<Plus size={13} />}
          onClick={() => { setAddOpen(true); setEditingId(null); }}>
          Add
        </Button>
      </div>

      {addOpen && (
        <AttendeeForm
          onSave={async (data) => {
            const a = await attendeesService.create(meetingId, data);
            handleAdd(a);
          }}
          onCancel={() => setAddOpen(false)}
          submitLabel="Add Attendee"
        />
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Spinner size={22} /></div>
      ) : attendees.length === 0 && !addOpen ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <UserCircle2 size={28} className="text-[var(--color-text-faint)]" />
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">No attendees yet.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--color-divider)]">
          {attendees.map((a) => (
            <div key={a.id}>
              {editingId === a.id ? (
                <div className="py-2">
                  <AttendeeForm
                    defaultValues={{ name: a.name, email: a.email, role: a.role }}
                    onSave={async (data) => {
                      const updated = await attendeesService.update(meetingId, a.id, data);
                      handleUpdate(updated);
                    }}
                    onCancel={() => setEditingId(null)}
                    submitLabel="Save Changes"
                  />
                </div>
              ) : (
                <div className="group flex items-center gap-3 py-3 hover:bg-[var(--color-surface-offset)] -mx-2 px-2 rounded-[var(--radius-md)] transition-colors duration-[180ms]">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary-highlight)] flex items-center justify-center shrink-0">
                    <span className="text-[var(--text-xs)] font-semibold text-[var(--color-primary)] uppercase">
                      {a.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)] truncate">{a.name}</p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate">
                      {[a.role, a.email].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-all duration-[180ms]">
                    <button onClick={() => setEditingId(a.id)} aria-label="Edit attendee"
                      className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dynamic)] hover:text-[var(--color-text)] transition-all duration-[180ms]">
                      <Pencil size={13} />
                    </button>
                    {confirmId === a.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(a.id)}
                          className="px-2 py-1 rounded-[var(--radius-sm)] text-[var(--text-xs)] bg-[var(--color-error)] text-white transition-all duration-[180ms]">
                          Delete
                        </button>
                        <button onClick={() => setConfirmId(null)}
                          className="px-2 py-1 rounded-[var(--radius-sm)] text-[var(--text-xs)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dynamic)] transition-all duration-[180ms]">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(a.id)} aria-label="Remove attendee"
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-error-highlight)] hover:text-[var(--color-error)] transition-all duration-[180ms]">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AttendeeForm({ defaultValues, onSave, onCancel, submitLabel }: {
  defaultValues?: Partial<CreateAttendeeInput>;
  onSave:         (data: CreateAttendeeInput) => Promise<void>;
  onCancel:       () => void;
  submitLabel:    string;
}) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateAttendeeInput>({
    defaultValues, mode: 'onSubmit',
  });

  const onSubmit = async (data: CreateAttendeeInput) => {
    setSaving(true);
    try { await onSave(data); toast.success('Saved'); }
    catch (err) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}
      className="mb-3 p-3 bg-[var(--color-surface-offset)] rounded-[var(--radius-lg)] flex flex-col gap-2" noValidate>
      <Input placeholder="Name *" error={errors.name?.message}
        {...register('name', { required: 'Name is required' })} />
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Email (optional)"  {...register('email')} />
        <Input placeholder="Role (optional)"   {...register('role')} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" loading={saving}>{submitLabel}</Button>
      </div>
    </form>
  );
}