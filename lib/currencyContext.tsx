'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { CURRENCIES } from './useCurrency'

const CurrencyContext = createContext<{
  currency: string
  setCurrency: (c: string) => void
}>({ currency: 'EUR', setCurrency: () => { } })

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState('EUR')

  useEffect(() => {
    const saved = localStorage.getItem('preferred_currency')
    if (saved && CURRENCIES.includes(saved)) setCurrencyState(saved)
  }, [])

  const setCurrency = (c: string) => {
    setCurrencyState(c)
    localStorage.setItem('preferred_currency', c)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrencyContext = () => useContext(CurrencyContext)