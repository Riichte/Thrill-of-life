'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from './supabase/client'
import { CURRENCIES } from './useCurrency'

const CurrencyContext = createContext<{
  currency: string
  setCurrency: (c: string) => void
}>({ currency: 'EUR', setCurrency: () => {} })

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState('EUR')
  const supabase = createClient()

  useEffect(() => {
    const saved = localStorage.getItem('preferred_currency')
    if (saved && CURRENCIES.includes(saved)) setCurrencyState(saved)

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase.from('profiles').select('preferred_currency').eq('id', data.user.id).single()
        .then(({ data: p }) => {
          if (p?.preferred_currency) setCurrencyState(p.preferred_currency)
        })
    })
  }, [])

  const setCurrency = async (c: string) => {
    setCurrencyState(c)
    localStorage.setItem('preferred_currency', c)
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      await supabase.from('profiles').update({ preferred_currency: c }).eq('id', data.user.id)
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrencyContext = () => useContext(CurrencyContext)