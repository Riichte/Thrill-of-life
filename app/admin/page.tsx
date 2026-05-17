import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import ImageManager from './ImageManager'

const ADMIN_EMAIL = 'rietsch.adrien@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const { data: parks } = await supabase.from('parks').select('*').order('name')
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  let allItems: any[] = []
  let from = 0
  const pageSize = 1000
  while (true) {
    const { data } = await supabase.from('items').select('*').order('name').range(from, from + pageSize - 1)
    if (!data || data.length === 0) break
    allItems = [...allItems, ...data]
    if (data.length < pageSize) break
    from += pageSize
  }
  const items = allItems

  return (
    <AdminDashboard
      parks={parks ?? []}
      categories={categories ?? []}
      items={items ?? []}
    />
  )
}

