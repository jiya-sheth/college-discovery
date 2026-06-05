import { formatCurrency } from '@/lib/utils';
import { Star, MapPin, TrendingUp, IndianRupee, Award, Users } from 'lucide-react';
import Link from 'next/link';

export function CompareTable({ colleges }: { colleges: any[] }) {
  const rows = [
    { label: 'Location', key: (c: any) => `${c.city}, ${c.state}`, icon: MapPin },
    { label: 'Category', key: (c: any) => c.category },
    { label: 'Type', key: (c: any) => c.type },
    { label: 'NIRF Rank', key: (c: any) => c.nirfRank ? `#${c.nirfRank}` : 'N/A', icon: Award },
    { label: 'Rating', key: (c: any) => `${c.rating.toFixed(1)} ⭐`, icon: Star },
    { label: 'Min Fees/yr', key: (c: any) => formatCurrency(c.minFees), icon: IndianRupee },
    { label: 'Max Fees/yr', key: (c: any) => formatCurrency(c.maxFees), icon: IndianRupee },
    { label: 'Avg Package', key: (c: any) => c.avgPackage ? formatCurrency(c.avgPackage) : 'N/A', icon: TrendingUp },
    { label: 'Max Package', key: (c: any) => c.maxPackage ? formatCurrency(c.maxPackage) : 'N/A', icon: TrendingUp },
    { label: 'Placement %', key: (c: any) => c.placementPct ? `${c.placementPct}%` : 'N/A', icon: Users },
    { label: 'NAAC Grade', key: (c: any) => c.naacGrade ?? 'N/A' },
    { label: 'Courses', key: (c: any) => `${c.courses?.length ?? 0} courses` },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left p-4 text-sm font-semibold text-gray-500 w-36">Parameter</th>
              {colleges.map((c) => (
                <th key={c.id} className="p-4 text-center">
                  <Link href={`/colleges/${c.slug}`} className="hover:text-brand-600 transition-colors">
                    <div className="font-bold text-gray-900 text-sm leading-tight">{c.name}</div>
                    <div className="text-xs text-gray-400 font-normal mt-0.5">{c.city}</div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                <td className="p-4 text-sm font-medium text-gray-600">{row.label}</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 text-center text-sm text-gray-900">{row.key(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}