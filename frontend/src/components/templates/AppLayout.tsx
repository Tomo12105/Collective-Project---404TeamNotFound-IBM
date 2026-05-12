import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarDays, CheckSquare, Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { authService } from '@/services/auth';
import { useAppStore } from '@/store/useAppStore';

const NAV_ITEMS = [
  { to: '/meetings', label: 'Meetings',   icon: CalendarDays },
  { to: '/tasks',    label: 'Tasks',      icon: CheckSquare  },
];

export default function AppLayout() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const username = useAppStore((s) => s.username);

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-divider)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-4 px-4 md:px-6 h-14" style={{ maxWidth: '100%' }}>
          {/* Logo */}
          <NavLink to="/meetings" className="flex items-center gap-2 shrink-0" aria-label="AutoMinutes home">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="var(--color-primary)" />
              <path d="M7 8h14M7 14h9M7 20h11" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="21" cy="20" r="3.5" fill="white" opacity="0.9" />
            </svg>
            <span className="text-[var(--text-base)] font-bold text-[var(--color-text)] hidden sm:block"
                  style={{ fontFamily: 'var(--font-display)' }}>
              AutoMinutes
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => [
                  'flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium transition-all duration-[180ms]',
                  isActive
                    ? 'bg-[var(--color-primary-highlight)] text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] hover:text-[var(--color-text)]',
                ].join(' ')}>
                <Icon size={15} />{label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />

          {username && (
            <span className="hidden md:block text-[var(--text-xs)] text-[var(--color-text-muted)]">
              {username}
            </span>
          )}

          {/* Theme toggle */}
          <button onClick={toggle} aria-label="Toggle theme"
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] transition-colors duration-[180ms]">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Sign out */}
          <button onClick={() => authService.logout()} aria-label="Sign out"
            className="hidden md:flex p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] transition-colors duration-[180ms]">
            <LogOut size={17} />
          </button>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
            className="md:hidden p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] transition-colors duration-[180ms]">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-[var(--color-divider)] bg-[var(--color-surface)] px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => [
                  'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium transition-all duration-[180ms]',
                  isActive
                    ? 'bg-[var(--color-primary-highlight)] text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)]',
                ].join(' ')}>
                <Icon size={16} />{label}
              </NavLink>
            ))}
            <button onClick={() => authService.logout()}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] transition-all duration-[180ms]">
              <LogOut size={16} />Sign out
            </button>
          </nav>
        )}
      </header>

      <main className="flex-1 w-full"><Outlet /></main>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-divider)] bg-[var(--color-surface)] flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => [
              'flex-1 flex flex-col items-center gap-1 py-2.5 text-[var(--text-xs)] font-medium transition-all duration-[180ms]',
              isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]',
            ].join(' ')}>
            <Icon size={19} />{label}
          </NavLink>
        ))}
      </nav>
      <div className="md:hidden h-16 shrink-0" aria-hidden="true" />
    </div>
  );
}
