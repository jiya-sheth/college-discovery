'use client';
import { CATEGORY_OPTIONS, STATE_OPTIONS, TYPE_OPTIONS } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Props {
  params: Record<string, string>;
  onChange: (key: string, value: string | null) => void;
}

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[];
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value || null)}
          className="input appearance-none pr-8 text-sm"
        >
          <option value="">All</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

export function CollegeFilters({ params, onChange }: Props) {
  const clearAll = () => {
    ['state', 'category', 'type', 'minFees', 'maxFees', 'minRating'].forEach((k) => onChange(k, null));
  };

  const hasFilters = ['state', 'category', 'type', 'minFees', 'maxFees', 'minRating'].some((k) => params[k]);

  return (
    <div>
      {hasFilters && (
        <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 mb-4 font-medium">
          Clear all filters
        </button>
      )}

      <FilterSelect
        label="Category"
        value={params.category ?? ''}
        options={CATEGORY_OPTIONS}
        onChange={(v) => onChange('category', v)}
      />

      <FilterSelect
        label="State"
        value={params.state ?? ''}
        options={STATE_OPTIONS}
        onChange={(v) => onChange('state', v)}
      />

      <FilterSelect
        label="Type"
        value={params.type ?? ''}
        options={TYPE_OPTIONS}
        onChange={(v) => onChange('type', v)}
      />

      {/* Fee Range */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Max Annual Fees</label>
        <div className="relative">
          <select
            value={params.maxFees ?? ''}
            onChange={(e) => onChange('maxFees', e.target.value || null)}
            className="input appearance-none pr-8 text-sm"
          >
            <option value="">Any</option>
            <option value="50000">Under ₹50K</option>
            <option value="100000">Under ₹1L</option>
            <option value="300000">Under ₹3L</option>
            <option value="500000">Under ₹5L</option>
            <option value="1000000">Under ₹10L</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Min Rating */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Min Rating</label>
        <div className="flex gap-1.5">
          {[3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onChange('minRating', params.minRating === String(r) ? null : String(r))}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                params.minRating === String(r)
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}