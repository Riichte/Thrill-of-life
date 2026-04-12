import { createClient } from '@/lib/supabase/server'

export default async function ParksPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('parks').select('*').order('name')
  
  console.log('Parks data:', JSON.stringify(data))
  console.log('Parks error:', JSON.stringify(error))

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl mb-4">Debug</h1>
      <pre className="text-sm text-green-400">{JSON.stringify({ data, error }, null, 2)}</pre>
    </div>
  )
}