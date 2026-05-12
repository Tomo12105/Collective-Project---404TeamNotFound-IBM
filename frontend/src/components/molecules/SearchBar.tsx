import { useRef } from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
  className?:  string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={['relative flex items-center', className].join(' ')}>
      <Search
        size={14}
        className="absolute left-3 text-[var(--color-text-muted)] pointer-events-none"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full pl-8 pr-8 py-2 text-[var(--text-sm)] rounded-[var(--radius-md)]',
          'bg-[var(--color-surface)] border border-[var(--color-border)]',
          'text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
          'transition-all duration-[180ms]',
        ].join(' ')}
      />
      {value && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          aria-label="Clear search"
          className="absolute right-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-[180ms]"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
