"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps as BaseProps } from "next-themes";

interface ThemeProviderProps extends BaseProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            {children}
        </NextThemesProvider>
    )
}
