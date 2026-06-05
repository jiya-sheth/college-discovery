'use client';
import Link from 'next/link';
import { MapPin, Star, TrendingUp, IndianRupee, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { SaveButton } from './save-button';

interface College {
  id: string; slug: string; name: string; location: string; city: string;
  state: string; type: string; category: string; rating: number; reviewCount: number;
  minFees: number; maxFees: number; nirfRank: number | null; imageUrl: string | null;
  avgPackage?: number | null; placementPct?: number | null; naacGrade?: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  Engineering: 'bg-blue-100 text-blue-700',
  Medical: 'bg-green-100 text-green-700',
  Management: 'bg-purple-100 text-purple-700',
  Arts: 'bg-orange-100 text-orange-700',
  Science: 'bg-cyan-100 text-cyan-700',
  Law: 'bg-red-100 text-red-700',
  Commerce: 'bg-yellow-100 text-yellow-700',
};

const TYPE_COLORS: Record<string, string> = {
  Public: 'bg-emerald-100 text-emerald-700',
  Private: 'bg-violet-100 text-violet-700',
  Deemed: 'bg-amber-100 text-amber-700',
};

export function CollegeCard({ college }: { college: College }) {
  const bgColor = `hsl(${Math.abs(college.name.charCodeAt(0) * 7 + college.name.charCodeAt(1) * 13) % 360}, 60%, 90%)`;
  const textColor = `hsl(${Math.abs(college.name.charCodeAt(0) * 7 + college.name.charCodeAt(1) * 13) % 360}, 50%, 35%)`;

  return (
    <div className="card group overflow-hidden flex flex-col">
      {/* Image / Banner */}
      <div className="relative h-36 bg-gradient-to-br from-brand-100 to-indigo-100 overflow-hidden">
        {college.imageUrl ? (
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
            <span className="text-4xl font-bold opacity-30" style={{ color: textColor }}>
              {college.name.split(' ').map(w => w[0]).slice(0, 3).join('')}
            </span>
          </div>
        )}
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {college.nirfRank && (
            <span className="badge bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
              <Award className="w-3 h-3 mr-1 inline text-yellow-500" />
              NIRF #{college.nirfRank}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <SaveButton collegeId={college.id} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex gap-1.5 mb-2 flex-wrap">
          <span className={`badge ${CATEGORY_COLORS[college.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {college.category}
          </span>
          <span className={`badge ${TYPE_COLORS[college.type] ?? 'bg-gray-100 text-gray-600'}`}>
            {college.type}
          </span>
          {college.naacGrade && (
            <span className="badge bg-indigo-100 text-indigo-700">NAAC {college.naacGrade}</span>
          )}
        </div>

        <Link href={`/colleges/${college.slug}`} className="group/link">
          <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover/link:text-brand-600 transition-colors line-clamp-2 mb-1">
            {college.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{college.city}, {college.state}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mt-auto pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-amber-500 mb-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-sm text-gray-900">{college.rating.toFixed(1)}</span>
            </div>
            <div className="text-xs text-gray-400">{college.reviewCount} reviews</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <IndianRupee className="w-3 h-3 text-gray-400" />
              <span className="font-bold text-sm text-gray-900">{formatCurrency(college.minFees)}</span>
            </div>
            <div className="text-xs text-gray-400">Min fees/yr</div>
          </div>
          <div className="text-center">
            {college.avgPackage ? (
              <>
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="font-bold text-sm text-gray-900">{formatCurrency(college.avgPackage)}</span>
                </div>
                <div className="text-xs text-gray-400">Avg pkg</div>
              </>
            ) : (
              <>
                <div className="font-bold text-sm text-gray-900 mb-0.5">—</div>
                <div className="text-xs text-gray-400">Avg pkg</div>
              </>
            )}
          </div>
        </div>

        <Link
          href={`/colleges/${college.slug}`}
          className="mt-3 w-full text-center text-xs font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 py-1.5 rounded-lg transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}