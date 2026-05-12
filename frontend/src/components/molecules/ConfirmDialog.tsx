import Button from '@/components/atoms/Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean; title: string; message: string;
  confirmLabel?: string; onConfirm: () => void; onCancel: () => void; loading?: boolean;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading = false }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-sm bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-lg)] flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-[var(--color-error)]"><AlertTriangle size={20} /></span>
          <div>
            <h3 id="confirm-title" className="text-[var(--text-base)] font-semibold text-[var(--color-text)]">{title}</h3>
            <p className="mt-1 text-[var(--text-sm)] text-[var(--color-text-muted)]">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
