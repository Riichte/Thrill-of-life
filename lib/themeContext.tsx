'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeId = 'dark-blue' | 'dark-neon' | 'light-blueprint' | 'light-tropical'

export const themes: { id: ThemeId; label: string; dark: boolean }[] = [
    { id: 'dark-blue', label: 'Deep', dark: true },
    { id: 'dark-neon', label: 'Neon', dark: true },
    { id: 'light-blueprint', label: 'Blueprint', dark: false },
    { id: 'light-tropical', label: 'Tropical', dark: false },
]

const ThemeContext = createContext<{
    theme: ThemeId
    setTheme: (t: ThemeId) => void
}>({ theme: 'dark-blue', setTheme: () => { } })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeId>('dark-blue')

    useEffect(() => {
        const saved = localStorage.getItem('theme') as ThemeId | null
        if (saved && themes.find(t => t.id === saved)) {
            applyTheme(saved)
            setThemeState(saved)
        }
    }, [])

    const setTheme = (t: ThemeId) => {
        applyTheme(t)
        setThemeState(t)
        localStorage.setItem('theme', t)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

function applyTheme(t: ThemeId) {
    document.documentElement.setAttribute('data-theme', t)
}

export const useTheme = () => useContext(ThemeContext)