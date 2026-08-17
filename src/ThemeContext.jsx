import React, { createContext, useContext, useLayoutEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('lab-theme', 'light');
  }, []);

  const value = {
    theme: 'light',
    setTheme: () => {},
    toggleTheme: () => {},
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
