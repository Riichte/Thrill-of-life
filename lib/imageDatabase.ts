'use client';

// lib/imageDatabase.ts
import { createClient } from './supabase/client';

export interface StoredImage {
  id: string;
  parkId?: string;
  itemId?: string;
  url: string;
  title: string;
  source: 'wikimedia' | 'unsplash';
  attribution: string;
  license: string;
  createdAt: string;
}

export async function saveImage(
  image: any,
  parkId?: string,
  itemId?: string
): Promise<StoredImage | null> {
  try {
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
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Save image error:', error);
    return null;
  }
}

export async function getImages(parkId?: string, itemId?: string): Promise<StoredImage[]> {
  try {
    let query = supabase.from('images').select('*');

    if (parkId) query = query.eq('park_id', parkId);
    if (itemId) query = query.eq('item_id', itemId);

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Get images error:', error);
    return [];
  }
}

export async function deleteImage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('images').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete image error:', error);
    return false;
  }
}