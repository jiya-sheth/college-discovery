'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CollegeCard } from '@/components/college/college-card';
import { Bookmark, GitCompare, User } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'colleges' | 'comparisons'>('colleges');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/saved')
        .then((r) => r.json())
        .then(setSaved)
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === 'loading' || loading) return (
    <div className="page-container">
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-8 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="page-container max-w-5xl">
      {/* Profile Header */}
      <div className="card p-6 mb-8 flex items-center gap-5">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-2xl font-bold">
          {session?.user?.name?.charAt(0).toUpperCase() ?? <User />}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{session?.user?.name}</h1>
          <p className="text-gray-500 text-sm">{session?.user?.email}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span>{saved?.savedColleges?.length ?? 0} saved colleges</span>
            <span>{saved?.savedComparisons?.length ?? 0} saved comparisons</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {[
          { key: 'colleges', label: 'Saved Colleges', icon: Bookmark },
          { key: 'comparisons', label: 'Saved Comparisons', icon: GitCompare },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'colleges' && (
        <>
          {saved?.savedColleges?.length === 0 ? (
            <div className="text-center py-16 card">
              <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">No saved colleges</h3>
              <p className="text-gray-400 text-sm mt-1">Save colleges to compare them later</p>
              <Link href="/colleges" className="btn-primary mt-4 inline-block">Browse Colleges</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {saved.savedColleges.map((sc: any) => (
                <CollegeCard key={sc.id} college={sc.college} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'comparisons' && (
        <>
          {saved?.savedComparisons?.length === 0 ? (
            <div className="text-center py-16 card">
              <GitCompare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">No saved comparisons</h3>
              <Link href="/compare" className="btn-primary mt-4 inline-block">Compare Colleges</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {saved.savedComparisons.map((sc: any) => {
                const colleges = [sc.collegeA, sc.collegeB, sc.collegeC].filter(Boolean);
                const slugs = colleges.map((c: any) => c.slug).join(',');
                return (
                  <Link key={sc.id} href={`/compare?colleges=${slugs}`} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow block">
                    <GitCompare className="w-5 h-5 text-brand-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{colleges.map((c: any) => c.name).join(' vs ')}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sc.name ?? 'Saved comparison'}</p>
                    </div>
                    <span className="text-sm text-brand-600 font-medium">View →</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}