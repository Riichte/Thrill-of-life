'use client'

import { UnitProvider } from '@/lib/unitContext'
import { ThemeProvider } from '@/lib/themeContext'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <UnitProvider>{children}</UnitProvider>
        </ThemeProvider>
    )
}