interface Props {
  className?: string;
  width?:     string;
  height?:    string;
}

export default function Skeleton({ className = '', width, height }: Props) {
  return (
    <div
      className={['skeleton rounded-[var(--radius-sm)]', className].join(' ')}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function MeetingCardSkeleton() {
  return (
    <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <Skeleton height="1.25rem" width="55%" />
        <Skeleton height="1.25rem" width="5rem" />
      </div>
      <div className="flex gap-3">
        <Skeleton height="0.875rem" width="7rem" />
        <Skeleton height="0.875rem" width="5rem" />
      </div>
      <Skeleton height="0.875rem" width="80%" />
      <div className="flex gap-2 mt-1">
        <Skeleton height="1.5rem" width="4rem" className="rounded-[var(--radius-full)]" />
        <Skeleton height="1.5rem" width="4rem" className="rounded-[var(--radius-full)]" />
      </div>
    </div>
  );
}

export function ActionItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton height="1.25rem" width="1.25rem" className="rounded-[var(--radius-sm)] shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton height="1rem" width="70%" />
        <Skeleton height="0.75rem" width="40%" />
      </div>
    </div>
  );
}
