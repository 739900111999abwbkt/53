import React, { createContext, useState, useContext, useMemo } from 'react';
import { themes } from './colors';

// Define the shape of the context
interface ThemeContextType {
  theme: typeof themes.light;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  toggleTheme: () => {},
  isDarkMode: false,
});

// Create a custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Create the provider component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Select the theme based on the state
  const theme = isDarkMode ? themes.dark : themes.light;

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ theme, toggleTheme, isDarkMode }),
    [theme, toggleTheme, isDarkMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
