'use client';

import { useState } from 'react';
import { searchImages } from '@/lib/imageSearch';
import { saveImageAction } from '@/lib/actions/imageActions';

interface ImageResult {
  url: string;
  title: string;
  source: 'wikimedia' | 'unsplash';
  attribution: string;
  license: string;
}

export default function ImageManager({ parkId, itemId }: { parkId?: string; itemId?: string } = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const images = await searchImages(query, 10);
    setResults(images);
    setLoading(false);
  };

  const handleSaveImage = async (image: ImageResult) => {
    await saveImageAction(image, parkId, itemId);
    alert('Image saved!');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search images (parks, rides, etc.)"
          className="flex-1 px-3 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((image, idx) => (
          <div key={idx} className="border rounded overflow-hidden">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                console.error(`Failed to load image: ${image.url}`);
                e.currentTarget.src = '/placeholder.png';
              }}
            />
            <div className="p-3 bg-gray-50 text-sm">
              <p className="font-semibold truncate">{image.title}</p>
              <p className="text-xs text-gray-600">{image.attribution}</p>
              <p className="text-xs text-gray-500">{image.source}</p>
              <button
                onClick={() => handleSaveImage(image)}
                className="mt-2 w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Save Image
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}