'use client';

import { useState, useEffect } from 'react';
import { searchImages } from '@/lib/imageSearch';
import { saveImageAction, deleteImageAction, fetchSavedImages } from '@/lib/actions/imageActions';

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
  title: string;
  category: string;
  attribution: string;
  source: string;
  created_at: string;
}

const CATEGORIES = ['roller coaster', 'park', 'show', 'restaurant', 'transport', 'flat ride', 'dark ride'];

export default function ImageManager() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadSavedImages();
  }, []);

  const loadSavedImages = async () => {
    const images = await fetchSavedImages();
    setSavedImages(images);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }
    setLoading(true);
    const images = await searchImages(query, 10);
    setResults(images);
    setLoading(false);
  };

  const handleSaveImage = async (image: ImageResult) => {
    try {
      await saveImageAction(image, selectedCategory);
      alert('Image saved!');
      setResults([]);
      setQuery('');
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
    <div className="space-y-6">
      {/* Search Section */}
      <div className="border rounded p-4 bg-gray-100">
        <h3 className="text-lg font-bold mb-4">Search & Add Images</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white"
            >
              <option value="">-- Select Category --</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search images..."
              className="flex-1 px-3 py-2 border rounded"
            />
            <button 
              type="submit" 
              disabled={!selectedCategory || loading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {results.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((image, idx) => (
              <div key={idx} className="border rounded overflow-hidden bg-white">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
                <div className="p-3 text-sm">
                  <p className="font-semibold truncate text-xs">{image.title}</p>
                  <p className="text-xs text-gray-600 truncate">{image.attribution}</p>
                  <button
                    onClick={() => handleSaveImage(image)}
                    className="mt-2 w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Images Section */}
      <div className="border rounded p-4 bg-gray-100">
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="text-lg font-bold mb-4 text-blue-600 hover:underline"
        >
          {showSaved ? '▼' : '▶'} Saved Images ({savedImages.length})
        </button>

        {showSaved && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {savedImages.map(image => (
              <div key={image.id} className="border rounded overflow-hidden bg-white relative group">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
                <div className="p-2 text-xs">
                  <p className="font-semibold truncate">{image.category}</p>
                  <p className="text-gray-600 truncate">{image.title}</p>
                </div>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={deleting === image.id}
                  className="absolute top-1 right-1 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {deleting === image.id ? '...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}