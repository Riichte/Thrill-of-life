import { searchAll } from '@/lib/queries'
import SearchClient from './SearchClient'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-[#8f98a0]">Enter a search term to get started.</p>
      </div>
    )
  }

  const results = await searchAll(query)

  return <SearchClient query={query} results={results} />
}