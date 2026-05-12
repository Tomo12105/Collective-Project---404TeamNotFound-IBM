import { ArrowDownAZ, ArrowUpAZ, ArrowDownUp, CalendarDays, X } from 'lucide-react';
import { MeetingFilters } from '@/types';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

interface Props {
  filters:   MeetingFilters;
  onChange:  (f: Partial<MeetingFilters>) => void;
  onReset:   () => void;
  hasActive: boolean;
}

const STATUS_OPTIONS = [
  { value: 'ALL',        label: 'All statuses' },
  { value: 'PENDING',    label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED',  label: 'Completed' },
  { value: 'FAILED',     label: 'Failed' },
];

const SORT_OPTIONS = [
  { value: 'dateTime|desc', label: 'Newest first' },
  { value: 'dateTime|asc',  label: 'Oldest first' },
  { value: 'title|asc',     label: 'Title A → Z' },
  { value: 'title|desc',    label: 'Title Z → A' },
];

export default function FilterBar({ filters, onChange, onReset, hasActive }: Props) {
  const sortValue = `${filters.sortBy}|${filters.sortOrder}`;

  const handleSort = (val: string) => {
    const [sortBy, sortOrder] = val.split('|') as [MeetingFilters['sortBy'], MeetingFilters['sortOrder']];
    onChange({ sortBy, sortOrder });
  };

  const SortIcon = filters.sortOrder === 'asc' ? ArrowUpAZ : ArrowDownAZ;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value as MeetingFilters['status'] })}
        options={STATUS_OPTIONS}
        className="text-[var(--text-xs)] py-1.5"
        aria-label="Filter by status"
      />

      <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-2 py-1.5">
        <SortIcon size={13} className="text-[var(--color-text-muted)]" />
        <select
          value={sortValue}
          onChange={(e) => handleSort(e.target.value)}
          aria-label="Sort meetings"
          className="text-[var(--text-xs)] bg-transparent text-[var(--color-text)] focus:outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<X size={12} />}
          onClick={onReset}
          className="text-[var(--text-xs)] text-[var(--color-text-muted)]"
        >
          Reset filters
        </Button>
      )}
    </div>
  );
}
