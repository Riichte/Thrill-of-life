'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveImageAction(image: any, parkId?: string, itemId?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('images')
    .insert({
      park_id: parkId,
      item_id: itemId,
      url: image.url,
      title: image.title,
      source: image.source,
      attribution: image.attribution,
      license: image.license,
      created_at: new Date()
    })
    .select()
    .single()

  if (error) throw error
  return data
}