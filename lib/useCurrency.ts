'use client'
import { useState, useEffect } from 'react'

const CACHE_KEY = 'fx_rates'
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24h

export const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'KRW', 'AED']

async function fetchRates(base: string): Promise<Record<string, number>> {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    const { rates, ts, b } = JSON.parse(cached)
    if (b === base && Date.now() - ts < CACHE_TTL) return rates
  }
  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`)
  const data = await res.json()
  localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: data.rates, ts: Date.now(), b: base }))
  return data.rates
}

export function useCurrency(sourceCurrency: string, preferredCurrency: string) {
  const [rate, setRate] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sourceCurrency === preferredCurrency) { setRate(1); return }
    setLoading(true)
    fetchRates(sourceCurrency)
      .then(rates => setRate(rates[preferredCurrency] ?? 1))
      .catch(() => setRate(1))
      .finally(() => setLoading(false))
  }, [sourceCurrency, preferredCurrency])

  const convert = (amount: number) => amount * rate
  const format = (amount: number) => {
    if (amount === 0) return 'Free'
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: preferredCurrency,
      maximumFractionDigits: 2,
    }).format(convert(amount))
  }

  return { convert, format, rate, loading }
}