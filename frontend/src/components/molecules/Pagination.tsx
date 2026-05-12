import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page:      number;
  totalPages: number;
  onPage:    (p: number) => void;
}

export default function Pagination({ page, totalPages, onPage }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-6" role="navigation" aria-label="Pagination">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-[180ms]"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        const isEllipsis =
          totalPages > 7 &&
          p !== 1 && p !== totalPages &&
          (p < page - 1 || p > page + 1);

        if (isEllipsis) {
          if (p === page - 2 || p === page + 2) {
            return <span key={p} className="px-1 text-[var(--color-text-faint)] text-[var(--text-xs)]">…</span>;
          }
          return null;
        }

        return (
          <button
            key={p}
            onClick={() => onPage(p)}
            aria-current={page === p ? 'page' : undefined}
            className={[
              'w-8 h-8 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium transition-all duration-[180ms]',
              page === p
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] hover:text-[var(--color-text)]',
            ].join(' ')}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-[180ms]"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
