import {
  mockParks,
  mockCategories,
  mockItems,
  mockItemImages,
  mockItemVideos
} from '@/lib/items-data'
import { parksData } from '@/lib/parks-data'

// ─── Parks ───────────────────────────────────────────────

export function getAllParks() {
  return parksData
}

export function getParkById(parkId: string) {
  return parksData.find(p => p.id === parkId) ?? null
}

// ─── Categories ──────────────────────────────────────────

export function getAllCategories() {
  return mockCategories
}

export function getCategoryById(categoryId: string) {
  return mockCategories.find(c => c.id === categoryId) ?? null
}

// ─── Items ───────────────────────────────────────────────

export function getItemsByPark(parkId: string) {
  return mockItems[parkId as keyof typeof mockItems] ?? []
}

export function getItemById(parkId: string, itemId: string) {
  const items = getItemsByPark(parkId)
  return items.find(i => i.id === itemId) ?? null
}

export function getItemsByCategory(parkId: string, categoryId: string) {
  return getItemsByPark(parkId).filter(i => i.category_id === categoryId)
}

// ─── Media ───────────────────────────────────────────────

export function getItemImages(itemId: string): string[] {
  return mockItemImages[itemId as keyof typeof mockItemImages] ?? []
}

export function getItemVideos(itemId: string): string[] {
  return mockItemVideos[itemId as keyof typeof mockItemVideos] ?? []
}

// ─── Similar rides ───────────────────────────────────────

export function getSimilarRides(itemId: string, type: string, limit = 6) {
  return Object.entries(mockItems)
    .flatMap(([pId, pItems]) =>
      pItems
        .filter(i => i.id !== itemId && i.specs?.type === type)
        .map(i => ({
          ...i,
          parkId: pId,
          parkName: mockParks.find(p => p.id === pId)?.name ?? '',
          image: (mockItemImages[i.id as keyof typeof mockItemImages] ?? [])[0] ?? null
        }))
    )
    .slice(0, limit)
}