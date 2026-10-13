import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../utils/theme';

interface Props {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onThemeChange }: Props) {
  return (
    <button type="button" onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
      className="icon-button transition-colors"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      {theme === 'light' ? <Moon size={19}/> : <Sun size={19}/>}
    </button>
  );
}
