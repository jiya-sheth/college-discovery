'use client';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface College {
  id: string; slug: string; name: string; city: string; state: string;
  category: string; type: string; rating: number; minFees: number; maxFees: number;
  avgPackage: number | null; placementPct: number | null; nirfRank: number | null;
  imageUrl: string | null; naacGrade: string | null; reviewCount: number; courses: any[];
}

interface Props {
  onSelect: (college: College) => void;
  excludeSlugs: string[];
}

export function CollegeSearchCombo({ onSelect, excludeSlugs }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setResults((data.colleges ?? []).filter((c: College) => !excludeSlugs.includes(c.slug)));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, excludeSlugs]);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search college..."
          className="input pl-9 text-sm"
        />
      </div>
      {open && (query || loading) && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {loading ? (
            <div className="p-3 text-sm text-gray-400">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-gray-400">No colleges found</div>
          ) : (
            results.map((c) => (
              <button key={c.id} onClick={() => { onSelect(c); setQuery(''); setOpen(false); }}
                className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className="font-medium text-sm text-gray-900 truncate">{c.name}</div>
                <div className="text-xs text-gray-400">{c.city}, {c.state}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}