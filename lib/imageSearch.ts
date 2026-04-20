// lib/imageSearch.ts
export interface ImageResult {
  url: string;
  title: string;
  source: 'wikimedia' | 'unsplash';
  attribution: string;
  license: string;
}

export async function searchWikimedia(query: string, limit: number = 5): Promise<ImageResult[]> {
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}+filetype:bitmap&srnamespace=6&srlimit=${limit}&format=json&origin=*`
    );
    const data = await response.json();

    const imagePromises = data.query.search.map((item: any) =>
      fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.title)}&prop=imageinfo&iiprop=url|user&format=json&origin=*`
      )
        .then(res => res.json())
        .then(imageData => {
          const page = Object.values(imageData.query.pages)[0] as any;
          if (page.imageinfo?.[0]) {
            return {
              url: page.imageinfo[0].url,
              title: item.title.replace('File:', ''),
              source: 'wikimedia' as const,
              attribution: page.imageinfo[0].user || 'Wikimedia Commons',
              license: 'CC BY-SA 4.0'
            };
          }
          return null;
        })
    );

    const results = await Promise.all(imagePromises);
    return results.filter(r => r !== null);
  } catch (error) {
    console.error('Wikimedia search error:', error);
    return [];
  }
}

export async function searchUnsplash(query: string, limit: number = 5): Promise<ImageResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_UNSPLASH_KEY not set');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${limit}&client_id=${apiKey}`
    );
    const data = await response.json();

    return data.results.map((item: any) => ({
      url: item.urls.regular,
      title: item.alt_description || item.description || query,
      source: 'unsplash' as const,
      attribution: `${item.user.name} on Unsplash`,
      license: 'Unsplash License'
    }));
  } catch (error) {
    console.error('Unsplash search error:', error);
    return [];
  }
}

export async function searchImages(query: string, limit: number = 5): Promise<ImageResult[]> {
  const wikimediaResults = await searchWikimedia(query, Math.ceil(limit / 2));
  const unsplashResults = await searchUnsplash(query, Math.floor(limit / 2));
  return [...wikimediaResults, ...unsplashResults];
}