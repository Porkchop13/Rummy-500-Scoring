import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/theme-context';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`rounded-full p-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none dark:focus:ring-offset-gray-800 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
      )}
    </button>
  );
};
