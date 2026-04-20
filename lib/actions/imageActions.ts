'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveImageToItemAction(image: any, itemId: string, imageType: string = 'main') {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('item_images')
    .insert({
      item_id: itemId,
      url: image.url.startsWith('http') ? image.url : `https://${image.url.replace(/^\/+/, '')}`,
      attribution_author: image.attribution,
      license: image.license,
      sort_order: imageType === 'logo' ? -1 : parseInt(imageType),
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

export async function saveParkImageAction(image: any, parkId: string, sortOrder: string = '0') {
  const supabase = await createClient()
  const url = image.url.startsWith('http') ? image.url : `https://${image.url.replace(/^\/+/, '')}`

  // If main image (sort_order 0), also update cover_image_url on the park
  if (sortOrder === '0') {
    await supabase.from('parks').update({ cover_image_url: url }).eq('id', parkId)
  }

  const { data, error } = await supabase
    .from('park_images')
    .insert({
      park_id: parkId,
      url: image.url.startsWith('http') ? image.url : `https://${image.url.replace(/^\/+/, '')}`,
      attribution_author: image.attribution,
      license: image.license,
      sort_order: sortOrder === 'logo' ? -1 : parseInt(sortOrder),
    })
    .select()
    .single()
  if (error) throw error
  return data
}