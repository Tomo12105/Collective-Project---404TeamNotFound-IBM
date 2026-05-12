import React from 'react';

type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

const config: Record<Status, { label: string; color: string; bg: string }> = {
  PENDING:     { label: 'Pending',     color: 'var(--color-warning)',  bg: 'var(--color-warning-highlight)' },
  IN_PROGRESS: { label: 'In Progress', color: 'var(--color-blue)',     bg: 'var(--color-blue-highlight)' },
  COMPLETED:   { label: 'Completed',   color: 'var(--color-success)',  bg: 'var(--color-success-highlight)' },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = (status as Status) in config ? (status as Status) : 'PENDING';
  const { label, color, bg } = config[s];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.125rem 0.5rem',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-xs)', fontWeight: 500,
      color, background: bg,
    }}>
      {label}
    </span>
  );
}