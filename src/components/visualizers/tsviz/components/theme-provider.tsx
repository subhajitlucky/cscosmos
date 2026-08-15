'use client';

import React from "react";
import { useTheme } from "@/context/useTheme";

export { useTheme };

export function ThemeProvider({ children }: { children: React.ReactNode; defaultTheme?: string; storageKey?: string }) {
    return <>{children}</>;
}
