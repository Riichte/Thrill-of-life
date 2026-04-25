'use client'

import { UnitProvider } from '@/lib/unitContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <UnitProvider>{children}</UnitProvider>
}