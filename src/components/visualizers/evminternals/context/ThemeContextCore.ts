import { createContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isNightMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
