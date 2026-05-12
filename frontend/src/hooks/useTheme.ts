import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useTheme() {
  const { theme, setTheme } = useAppStore();

  // On first load, read system preference
  useEffect(() => {
    const stored = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    }
  }, []);

  // Keep HTML attribute in sync with store
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return { theme, toggle };
}
