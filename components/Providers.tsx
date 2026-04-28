// line 3 — add import
import { CurrencyProvider } from '@/lib/currencyContext'

// wrap children — replace return:
return (
  <ThemeProvider>
    <CurrencyProvider>
      <UnitProvider>{children}</UnitProvider>
    </CurrencyProvider>
  </ThemeProvider>
)