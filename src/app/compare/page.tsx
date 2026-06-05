'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { CollegeSearchCombo } from '@/components/compare/college-search-combo';
import { CompareTable } from '@/components/compare/compare-table';
import { GitCompare, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CollegeSummary {
  id: string; slug: string; name: string; city: string; state: string;
  category: string; type: string; rating: number; minFees: number; maxFees: number;
  avgPackage: number | null; placementPct: number | null; nirfRank: number | null;
  imageUrl: string | null; naacGrade: string | null; reviewCount: number;
  courses: any[];
}

export default function ComparePage() {
  const [selected, setSelected] = useState<(CollegeSummary | null)[]>([null, null, null]);
  const [comparedData, setComparedData] = useState<CollegeSummary[] | null>(null);
  const [loading, setLoading] = useState(false);

  const filledCount = selected.filter(Boolean).length;

  const handleSelect = (index: number, college: CollegeSummary | null) => {
    const updated = [...selected];
    updated[index] = college;
    setSelected(updated);
    setComparedData(null);
  };

  const handleCompare = async () => {
    const slugs = selected.filter(Boolean).map((c) => c!.slug);
    if (slugs.length < 2) {
      toast.error('Select at least 2 colleges to compare');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs }),
      });
      const data = await res.json();
      setComparedData(data.colleges);
    } catch {
      toast.error('Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
          <GitCompare className="w-4 h-4" /> Compare Tool
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Compare Colleges Side-by-Side</h1>
        <p className="text-gray-500 mt-2">Select 2 or 3 colleges to compare fees, placements, ratings and more</p>
      </div>

      {/* College Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {selected.map((college, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">College {i + 1}{i === 2 ? ' (Optional)' : ''}</span>
              {college && (
                <button onClick={() => handleSelect(i, null)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {college ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                  {college.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{college.name}</p>
                  <p className="text-xs text-gray-500">{college.city}, {college.state}</p>
                </div>
              </div>
            ) : (
              <CollegeSearchCombo
                onSelect={(c) => handleSelect(i, c)}
                excludeSlugs={selected.filter(Boolean).map((s) => s!.slug)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Compare Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleCompare}
          disabled={filledCount < 2 || loading}
          className="btn-primary px-8 py-3 text-base disabled:opacity-50"
        >
          {loading ? 'Comparing...' : `Compare ${filledCount} College${filledCount !== 1 ? 's' : ''}`}
        </button>
        {filledCount < 2 && (
          <p className="text-sm text-gray-400 mt-2">Select at least 2 colleges to compare</p>
        )}
      </div>

      {/* Comparison Table */}
      {comparedData && <CompareTable colleges={comparedData} />}
    </div>
  );
}