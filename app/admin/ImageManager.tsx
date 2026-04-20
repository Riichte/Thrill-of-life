'use client';

import { useState, useEffect } from 'react';
import { searchImages } from '@/lib/imageSearch';
import { saveImageToItemAction, deleteImageAction, fetchSavedImages, saveParkImageAction } from '@/lib/actions/imageActions';
import { createClient } from '@/lib/supabase/client';

interface ImageResult {
  url: string;
  title: string;
  source: 'wikimedia' | 'unsplash';
  attribution: string;
  license: string;
}

interface SavedImage {
  id: string;
  url: string;
  item_id: string;
  attribution_author?: string;
  license?: string;
}

interface Item {
  id: string;
  name: string;
  category_id: string;
}

export default function ImageManager({ items: initialItems, categories, parks }: { items: Item[]; categories: any[]; parks: any[] }) {
  const supabase = createClient();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filteredItems = initialItems.filter(item => item.category_id === selectedCategory);

  useEffect(() => {
    loadSavedImages();
  }, []);

  const loadSavedImages = async () => {
    try {
      const { data } = await supabase.from('item_images').select('*').order('created_at', { ascending: false });
      setSavedImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedItem) {
      alert('Please select both category and item');
      return;
    }
    setLoading(true);
    try {
      const images = await searchImages(query, 30);
      setResults(images);
    } catch (error) {
      alert('Search failed');
    }
    setLoading(false);
  };

  const handleSaveImage = async (image: ImageResult, idx: number) => {
  if (!selectedItem) {
    alert('Please select an item');
    return;
  }
  const typeSelect = document.getElementById(`sort-${idx}`) as HTMLSelectElement;
  try {
    if (selectedItem.startsWith('park-')) {
      await saveParkImageAction(image, selectedItem.replace('park-', ''), typeSelect.value);
    } else {
      await saveImageToItemAction(image, selectedItem, typeSelect.value);
    }
    alert('Image saved!');
    loadSavedImages();
  } catch (error) {
    alert('Failed to save image');
  }
};

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Delete this image?')) return;
    setDeleting(imageId);
    try {
      await deleteImageAction(imageId);
      setSavedImages(savedImages.filter(img => img.id !== imageId));
    } catch (error) {
      alert('Failed to delete image');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6 bg-[#1b2838] border border-[#2a475e] rounded-sm p-6">
      {/* Search Section */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-[#c6d4df]">Search & Add Images</h3>

        <div className="space-y-4">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-2">
              Category *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedItem('');
                setResults([]);
              }}
              className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] focus:outline-none focus:border-[#66c0f4]"
            >
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="parks"> Park Images</option>
            </select>
          </div>

          {/* Item Dropdown */}
          {selectedCategory && selectedCategory !== 'parks' && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-2">
                Item *
              </label>
              <select
                value={selectedItem}
                onChange={(e) => { setSelectedItem(e.target.value); setResults([]) }}
                className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] focus:outline-none focus:border-[#66c0f4]"
              >
                <option value="">-- Select Item --</option>
                {filteredItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          )}
          {selectedCategory === 'parks' && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8f98a0] mb-2">
                Park *
              </label>
              <select
                value={selectedItem}
                onChange={(e) => { setSelectedItem(e.target.value); setResults([]) }}
                className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] focus:outline-none focus:border-[#66c0f4]"
              >
                <option value="">-- Select Park --</option>
                {parks.map(park => (
                  <option key={park.id} value={`park-${park.id}`}>{park.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Search Input */}
          {selectedItem && (
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search images..."
                className="flex-1 bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-3 py-2 text-sm text-[#c6d4df] placeholder-[#6a8a9a] focus:outline-none focus:border-[#66c0f4]"
              />
              <button
                type="submit"
                disabled={!selectedItem || loading}
                className="px-4 py-2 bg-[#4c6b22] hover:bg-[#5a7a28] disabled:opacity-50 text-white text-sm font-medium rounded-sm transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          )}
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((image, idx) => (
              <div key={idx} className="border border-[#2a475e] rounded-sm overflow-hidden bg-[#0e1419]">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
                <div className="p-2 space-y-1">
                  <p className="font-semibold text-xs text-[#c6d4df] line-clamp-2">{image.title}</p>
                  <p className="text-xs text-[#8f98a0] line-clamp-1">{image.attribution}</p>
                  <p className="text-xs text-[#6a8a9a]">{image.source}</p>
                  <button
                    onClick={() => handleSaveImage(image, idx)}
                    className="mt-2 w-full px-2 py-1 bg-[#4c6b22] hover:bg-[#5a7a28] text-white text-xs rounded-sm transition-colors"
                  >
                    Save
                  </button>
                </div>
                <div className="text-xs text-[#6a8a9a] mb-2">
                  <label className="block text-xs font-medium text-[#8f98a0] mb-1">Use as:</label>
                  <select
                    id={`sort-${idx}`}
                    defaultValue="1"
                    className="w-full bg-[#2a475e] border border-[#3d6a8a] rounded-sm px-2 py-1 text-xs text-[#c6d4df]"
                  >
                    <option value="0">Main</option>
                    <option value="1">Logo</option>     
                    <option value="2">Image 1</option>
                    <option value="3">Image 2</option>
                    <option value="4">Image 3</option>
                    <option value="5">Image 4</option>
                    <option value="6">Image 5</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Images Section */}
      <div className="border-t border-[#2a475e] pt-6">
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="text-[#66c0f4] hover:text-[#c6d4df] font-bold text-sm"
        >
          {showSaved ? '▼' : '▶'} Saved Images ({savedImages.length})
        </button>

        {showSaved && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {savedImages.length === 0 ? (
              <p className="text-sm text-[#8f98a0] col-span-full">No images saved yet.</p>
            ) : (
              savedImages.map(image => (
                <div
                  key={image.id}
                  className="border border-[#2a475e] rounded-sm overflow-hidden bg-[#0e1419] relative group"
                >
                  <img
                    src={image.url}
                    alt="saved"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.png';
                    }}
                  />
                  <div className="p-2 text-xs">
                    <p className="text-[#8f98a0] truncate">
                      {initialItems.find(i => i.id === image.item_id)?.name || 'Unknown'}
                    </p>
                    {image.attribution_author && (
                      <p className="text-[#6a8a9a] text-xs truncate">📷 {image.attribution_author}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={deleting === image.id}
                    className="absolute top-1 right-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    {deleting === image.id ? '...' : 'Delete'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}