import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for server-side rendering
    if (typeof window === 'undefined') return 'light';

    // Check if user has set a preference in localStorage
    const savedTheme = localStorage.getItem('theme');

    // Check if user prefers dark mode at the OS level
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Return saved preference or OS preference
    return savedTheme === 'dark' || savedTheme === 'light' ? (savedTheme as Theme) : prefersDark ? 'dark' : 'light';
  });

  // Apply theme class to HTML element whenever theme changes
  useEffect(() => {
    // Only run effect on client-side
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
