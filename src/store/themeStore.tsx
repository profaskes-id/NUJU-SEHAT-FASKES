import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always default to light for now as requested
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // Force remove dark class on mount and whenever theme changes to light
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    
    // Also clear any saved dark preference to ensure it stays light
    if (localStorage.getItem('theme') === 'dark') {
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    // Disabled for now, or just keep it light
    setThemeState('light');
  };
  
  const setTheme = (newTheme: Theme) => {
    // Only allow light for now
    setThemeState('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
