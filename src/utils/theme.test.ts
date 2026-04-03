import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInitialTheme, applyTheme, toggleTheme } from './theme';

// jsdom doesn't implement matchMedia; provide a stub before each test
function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches: prefersDark }),
  });
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  mockMatchMedia(false);
});

// ─── getInitialTheme ──────────────────────────────────────────────────────────

describe('getInitialTheme', () => {
  it('returns "dark" when localStorage has "dark"', () => {
    localStorage.setItem('theme', 'dark');
    expect(getInitialTheme()).toBe('dark');
  });

  it('returns "light" when localStorage has "light"', () => {
    localStorage.setItem('theme', 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('ignores invalid localStorage value and falls back to system preference', () => {
    localStorage.setItem('theme', 'blue');
    mockMatchMedia(false);
    expect(getInitialTheme()).toBe('light');
  });

  it('returns "dark" when no stored theme and system prefers dark', () => {
    mockMatchMedia(true);
    expect(getInitialTheme()).toBe('dark');
  });

  it('returns "light" when no stored theme and system prefers light', () => {
    mockMatchMedia(false);
    expect(getInitialTheme()).toBe('light');
  });
});

// ─── applyTheme ───────────────────────────────────────────────────────────────

describe('applyTheme', () => {
  it('sets data-theme="dark" on <html>', () => {
    applyTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('sets data-theme="light" on <html>', () => {
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('overwrites a previous theme', () => {
    applyTheme('dark');
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

// ─── toggleTheme ──────────────────────────────────────────────────────────────

describe('toggleTheme', () => {
  it('switches from light to dark', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    expect(toggleTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('switches from dark to light', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    expect(toggleTheme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('persists the new theme in localStorage', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleTheme();
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('treats missing data-theme as light and toggles to dark', () => {
    // no attribute set — should default to toggling toward dark
    expect(toggleTheme()).toBe('dark');
  });
});
