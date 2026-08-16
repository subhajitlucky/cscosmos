import type { FC, ReactNode } from 'react';

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};