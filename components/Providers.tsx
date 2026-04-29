'use client'
import { UnitProvider } from '@/lib/unitContext'
import { ThemeProvider } from '@/lib/themeContext'
import { CurrencyProvider } from '@/lib/currencyContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <UnitProvider>{children}</UnitProvider>
      </CurrencyProvider>
    </ThemeProvider>
  )
}