'use client'
import { createContext, useContext, useState } from 'react'

const UnitContext = createContext<{
    unit: 'metric' | 'imperial'
    setUnit: (u: 'metric' | 'imperial') => void
    convert: (value: string) => string
    convertHeight: (value: string) => string
    convertSpeed: (value: string) => string
    convertMinHeight: (value: string) => string
}>({
    unit: 'metric',
    setUnit: () => { },
    convert: (v) => v,
    convertHeight: (v) => v,
    convertSpeed: (v) => v,
    convertMinHeight: (v) => v,
})

export function UnitProvider({ children }: { children: React.ReactNode }) {
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')

    const convert = (value: string) => {
        if (unit === 'metric') return value
        return value.replace(/(\d+(?:\.\d+)?)\s*cm\b/g, (_, n) =>
            `${Math.round(parseFloat(n) * 0.394)} in`
        ).replace(/(\d+(?:\.\d+)?)\s*m\b/g, (_, n) =>
            `${Math.round(parseFloat(n) * 3.281)} ft`
        ).replace(/(\d+(?:\.\d+)?)\s*km\/h/g, (_, n) =>
            `${Math.round(parseFloat(n) * 0.621)} mph`
        )
    }

    const convertHeight = (value: string) => {
        if (!value) return value
        const num = parseFloat(value)
        if (isNaN(num)) return value
        if (unit === 'imperial') return `${Math.round(num * 3.281)} ft`
        return `${num}m`
    }

    const convertSpeed = (value: string) => {
        if (!value) return value
        const num = parseFloat(value)
        if (isNaN(num)) return value
        if (unit === 'imperial') return `${Math.round(num * 0.621)} mph`
        return `${num} km/h`
    }

    const convertMinHeight = (value: string) => {
        if (!value) return value
        const num = parseFloat(value)
        if (isNaN(num)) return value
        if (unit === 'imperial') return `${Math.round(num * 0.394)} in`
        return `${num}cm`
    }

    return (
        <UnitContext.Provider value={{ unit, setUnit, convert, convertHeight, convertSpeed, convertMinHeight }}>
            {children}
        </UnitContext.Provider>
    )
}

export const useUnit = () => useContext(UnitContext)