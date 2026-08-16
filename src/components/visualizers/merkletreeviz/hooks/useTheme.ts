import { useTheme as useGlobalTheme } from '@/context/useTheme';

export const useTheme = () => {
  const { theme, setTheme } = useGlobalTheme();
  return {
    theme: (theme === 'dark' ? 'dark' : 'light') as 'dark' | 'light',
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  };
};
