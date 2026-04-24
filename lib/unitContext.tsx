'use client'
import { createContext, useContext, useState } from 'react'

const UnitContext = createContext<{
    unit: 'metric' | 'imperial'
    setUnit: (u: 'metric' | 'imperial') => void
    convert: (value: string) => string
}>({ unit: 'metric', setUnit: () => { }, convert: (v) => v })

export function UnitProvider({ children }: { children: React.ReactNode }) {
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')

    const convert = (value: string) => {
        if (unit === 'metric') return value
        // height/drop/length in meters → feet
        return value.replace(/(\d+(?:\.\d+)?)\s*cm\b/g, (_, n) =>
            `${Math.round(parseFloat(n) * 0.394)} in`
        ).replace(/(\d+(?:\.\d+)?)\s*m\b/g, (_, n) =>
            `${Math.round(parseFloat(n) * 3.281)} ft`
        ).replace(/(\d+(?:\.\d+)?)\s*km\/h/g, (_, n) =>
            `${Math.round(parseFloat(n) * 0.621)} mph`
        )
    }

    return <UnitContext.Provider value={{ unit, setUnit, convert }}>{children}</UnitContext.Provider>
}

export const useUnit = () => useContext(UnitContext)