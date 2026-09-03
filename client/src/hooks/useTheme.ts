import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config/constants';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME, theme);
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
