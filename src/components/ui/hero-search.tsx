'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/colleges?q=${encodeURIComponent(query)}`);
    else router.push('/colleges');
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="flex gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search colleges, cities, courses..."
            className="w-full bg-transparent pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none text-base"
          />
        </div>
        <button type="submit"
          className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shrink-0">
          Search
        </button>
      </div>
    </form>
  );
}