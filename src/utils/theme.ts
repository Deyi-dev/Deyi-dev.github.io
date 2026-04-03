export type Theme = 'light' | 'dark';

/** Read stored preference, fall back to OS setting. */
export function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Write data-theme on <html>. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

/** Flip current theme, persist, and return the new value. */
export function toggleTheme(): Theme {
  const current = document.documentElement.getAttribute('data-theme');
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
  return next;
}
