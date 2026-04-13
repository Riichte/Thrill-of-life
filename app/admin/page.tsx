import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

const ADMIN_EMAIL = 'rietsch.adrien@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const { data: parks } = await supabase.from('parks').select('*').order('name')
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  const { data: items } = await supabase.from('items').select('*').order('name')

  return (
    <AdminDashboard
      parks={parks ?? []}
      categories={categories ?? []}
      items={items ?? []}
    />
  )
}

const { data: parks } = await supabase.from('parks').select('*').order('name')
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  const { data: items } = await supabase.from('items').select('*').order('name')

  console.log('Parks count:', parks?.length) // 👈 add this line

  return (
    <AdminDashboard