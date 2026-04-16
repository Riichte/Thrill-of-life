'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveImageToItemAction(image: any, itemId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('item_images')
    .insert({
      item_id: itemId,
      url: image.url,
      attribution_author: image.attribution,
      license: image.license,
      sort_order: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteImageAction(imageId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('item_images')
    .delete()
    .eq('id', imageId)

  if (error) throw error
}

export async function fetchSavedImages() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('item_images')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}