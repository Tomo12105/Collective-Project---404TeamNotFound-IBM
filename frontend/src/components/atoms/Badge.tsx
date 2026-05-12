import React from 'react';
import { ProcessingStatus, ActionItemStatus } from '@/types';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted';

interface BadgeProps { variant?: BadgeVariant; children: React.ReactNode; className?: string; }

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-surface-offset)] text-[var(--color-text-muted)]',
  primary: 'bg-[var(--color-primary-highlight)] text-[var(--color-primary)]',
  success: 'bg-[var(--color-success-highlight)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-highlight)] text-[var(--color-warning)]',
  error:   'bg-[var(--color-error-highlight)] text-[var(--color-error)]',
  muted:   'bg-[var(--color-surface-dynamic)] text-[var(--color-text-faint)]',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={[
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-full)]',
      'text-[var(--text-xs)] font-medium leading-none',
      variantClasses[variant], className,
    ].join(' ')}>
      {children}
    </span>
  );
}

const processingMap: Record<ProcessingStatus, BadgeVariant> = {
  PENDING: 'muted', PROCESSING: 'warning', COMPLETED: 'success', FAILED: 'error',
};
const processingLabels: Record<ProcessingStatus, string> = {
  PENDING: 'Pending', PROCESSING: 'Processing', COMPLETED: 'Completed', FAILED: 'Failed',
};

export function ProcessingStatusBadge({ status }: { status: ProcessingStatus }) {
  return <Badge variant={processingMap[status]}>{processingLabels[status]}</Badge>;
}

const actionMap: Record<ActionItemStatus, BadgeVariant> = {
  OPEN: 'error', IN_PROGRESS: 'warning', DONE: 'success', UNKNOWN: 'muted',
};
const actionLabels: Record<ActionItemStatus, string> = {
  OPEN: 'Open', IN_PROGRESS: 'In Progress', DONE: 'Done', UNKNOWN: 'Unknown',
};

export function ActionStatusBadge({ status }: { status: ActionItemStatus }) {
  return <Badge variant={actionMap[status]}>{actionLabels[status]}</Badge>;
}
