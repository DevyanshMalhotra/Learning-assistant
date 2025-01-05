export type Theme = 'light' | 'dark';

export function setTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}

export function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem('theme') as Theme;
  return savedTheme || 'light';
}