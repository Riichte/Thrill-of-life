'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveImageAction(image: any, category: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('images')
    .insert({
      category: category,
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

export async function deleteImageAction(imageId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId)

  if (error) throw error
}

export async function fetchSavedImages() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}