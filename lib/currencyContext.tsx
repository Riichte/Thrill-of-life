'use client'
import { createContext, useContext, useState } from 'react'

const CurrencyContext = createContext<{
  currency: string
  setCurrency: (c: string) => void
}>({ currency: 'EUR', setCurrency: () => { } })

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState('EUR')
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrencyContext = () => useContext(CurrencyContext)