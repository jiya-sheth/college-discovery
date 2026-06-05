'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CollegeCard } from '@/components/college/college-card';
import { CollegeFilters } from '@/components/college/college-filters';
import { SearchBar } from '@/components/ui/search-bar';
import { Pagination } from '@/components/ui/pagination';
import { CollegeCardSkeleton } from '@/components/college/college-card-skeleton';
import { SlidersHorizontal, X } from 'lucide-react';

interface College {
  id: string; slug: string; name: string; location: string; city: string;
  state: string; type: string; category: string; rating: number; reviewCount: number;
  minFees: number; maxFees: number; nirfRank: number | null; imageUrl: string | null;
  avgPackage: number | null; placementPct: number | null; naacGrade: string | null;
}

function CollegesInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?${searchParams.toString()}`);
      const data = await res.json();
      setColleges(data.colleges ?? []);
      setPagination(data.pagination ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => { fetchColleges(); }, [fetchColleges]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.set('page', '1');
    router.push(`/colleges?${params.toString()}`);
  };

  const activeFiltersCount = ['state', 'category', 'type', 'minFees', 'maxFees', 'minRating']
    .filter((k) => searchParams.get(k)).length;

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore Colleges</h1>
        <p className="text-gray-500 mt-1">
          {pagination ? `${pagination.total.toLocaleString()} colleges found` : 'Searching...'}
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search colleges, cities, states..."
            defaultValue={searchParams.get('q') ?? ''}
            onSearch={(q) => updateParam('q', q || null)}
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2 relative">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <aside className="w-64 shrink-0">
            <div className="card p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CollegeFilters params={Object.fromEntries(searchParams)} onChange={updateParam} />
            </div>
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 text-sm flex-wrap">
              {['rating', 'minFees', 'nirfRank', 'reviewCount'].map((sort) => (
                <button key={sort} onClick={() => updateParam('sortBy', sort)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    (searchParams.get('sortBy') ?? 'rating') === sort
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}>
                  {sort === 'rating' ? 'Top Rated' : sort === 'minFees' ? 'Lowest Fees' : sort === 'nirfRank' ? 'NIRF Rank' : 'Most Reviewed'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-gray-700">No colleges found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              <button onClick={() => router.push('/colleges')} className="btn-primary mt-4">Clear All</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {colleges.map((c) => <CollegeCard key={c.id} college={c} />)}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => updateParam('page', String(p))} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="page-container"><div className="text-gray-500">Loading...</div></div>}>
      <CollegesInner />
    </Suspense>
  );
}