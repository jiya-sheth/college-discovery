'use client';
import { useState } from 'react';
import { MapPin, Star, Globe, Award, Users, TrendingUp, IndianRupee, Check, BookOpen } from 'lucide-react';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { SaveButton } from './save-button';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const TABS = ['Overview', 'Courses', 'Placements', 'Reviews'] as const;
type Tab = typeof TABS[number];

export function CollegeDetailClient({ college }: { college: any }) {
  const [tab, setTab] = useState<Tab>('Overview');
  const { data: session } = useSession();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 4, title: '', content: '', pros: '', cons: '' });
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async () => {
    if (!session) { window.location.href = '/auth/login'; return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/colleges/${college.slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? 'Failed');
      } else {
        toast.success('Review submitted!');
        setShowReviewForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-56 md:h-72 bg-gradient-to-br from-brand-700 to-indigo-700 overflow-hidden">
        {college.imageUrl && (
          <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="badge bg-white/20 text-white backdrop-blur-sm">{college.category}</span>
                  <span className="badge bg-white/20 text-white backdrop-blur-sm">{college.type}</span>
                  {college.naacGrade && <span className="badge bg-yellow-400 text-yellow-900">NAAC {college.naacGrade}</span>}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{college.name}</h1>
                <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{college.location}</span>
                  {college.established && <span>· Est. {college.established}</span>}
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <SaveButton collegeId={college.id} />
                <Link href={`/compare?add=${college.slug}`} className="btn-secondary text-sm">
                  + Compare
                </Link>
                {college.website && (
                  <a href={college.website} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100">
            {[
              { icon: Star, label: 'Rating', value: `${college.rating.toFixed(1)} / 5`, sub: `${college.reviewCount} reviews`, color: 'text-amber-500' },
              { icon: Award, label: 'NIRF Rank', value: college.nirfRank ? `#${college.nirfRank}` : 'N/A', sub: 'National', color: 'text-brand-600' },
              { icon: IndianRupee, label: 'Annual Fees', value: formatCurrency(college.minFees), sub: `up to ${formatCurrency(college.maxFees)}`, color: 'text-green-600' },
              { icon: TrendingUp, label: 'Avg Package', value: college.avgPackage ? formatCurrency(college.avgPackage) : 'N/A', sub: college.maxPackage ? `Max: ${formatCurrency(college.maxPackage)}` : '', color: 'text-purple-600' },
              { icon: Users, label: 'Placement', value: college.placementPct ? `${college.placementPct}%` : 'N/A', sub: 'placement rate', color: 'text-blue-600' },
            ].map((s, i) => (
              <div key={i} className="px-4 py-4 text-center">
                <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                <div className="font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400">{s.sub || s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="page-container max-w-5xl">
        {/* Overview */}
        {tab === 'Overview' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About {college.name}</h2>
              <p className="text-gray-600 leading-relaxed">{college.description}</p>
            </div>
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Campus Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'hostel', label: 'Hostel' },
                  { key: 'scholarship', label: 'Scholarship' },
                  { key: 'sports', label: 'Sports' },
                  { key: 'labs', label: 'Research Labs' },
                  { key: 'library', label: 'Library' },
                ].map((f) => (
                  <div key={f.key} className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${college[f.key] ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                    <Check className={`w-4 h-4 ${college[f.key] ? 'text-green-500' : 'text-gray-300'}`} />
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Courses */}
        {tab === 'Courses' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Available Courses ({college.courses.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {college.courses.map((c: any) => (
                <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge bg-brand-100 text-brand-700">{c.degree}</span>
                      <span className="text-xs text-gray-400">{c.duration} years</span>
                      {c.seats && <span className="text-xs text-gray-400">· {c.seats} seats</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
                    {c.exams.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {c.exams.map((e: string) => (
                          <span key={e} className="badge bg-gray-100 text-gray-500">{e}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-gray-900">{formatCurrency(c.minFees)} – {formatCurrency(c.maxFees)}</div>
                    <div className="text-xs text-gray-400">per year</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placements */}
        {tab === 'Placements' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Average Package', value: college.avgPackage ? formatCurrency(college.avgPackage) : 'N/A', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
                { label: 'Highest Package', value: college.maxPackage ? formatCurrency(college.maxPackage) : 'N/A', icon: Award, color: 'text-purple-600 bg-purple-50' },
                { label: 'Placement Rate', value: college.placementPct ? `${college.placementPct}%` : 'N/A', icon: Users, color: 'text-blue-600 bg-blue-50' },
              ].map((s) => (
                <div key={s.label} className="card p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${s.color.split(' ')[1]}`}>
                    <s.icon className={`w-6 h-6 ${s.color.split(' ')[0]}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-sm text-gray-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-3">About Placements</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {college.name} has a dedicated Training and Placement Cell that maintains strong industry relationships. 
                Top recruiters include leading MNCs, startups, and PSUs. The placement cell organises campus drives, 
                mock interviews, and skill development workshops throughout the academic year.
              </p>
            </div>
          </div>
        )}

        {/* Reviews */}
        {tab === 'Reviews' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Student Reviews ({college._count.reviews})</h2>
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-primary text-sm">
                {showReviewForm ? 'Cancel' : '+ Write Review'}
              </button>
            </div>

            {showReviewForm && (
              <div className="card p-5 space-y-3">
                <h3 className="font-semibold">Your Review</h3>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((r) => (
                    <button key={r} onClick={() => setReviewForm({ ...reviewForm, rating: r })} className={`text-2xl ${r <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
                  ))}
                </div>
                <input value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="Title" className="input" />
                <textarea value={reviewForm.content} onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })} placeholder="Your experience..." rows={4} className="input resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={reviewForm.pros} onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })} placeholder="Pros" className="input" />
                  <input value={reviewForm.cons} onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })} placeholder="Cons" className="input" />
                </div>
                <button onClick={submitReview} disabled={submitting} className="btn-primary w-full">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {college.reviews.map((r: any) => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-lg ${i < Math.round(r.rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                        ))}
                        <span className="text-sm font-semibold ml-1">{r.rating}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">{r.title}</h4>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      <div>{r.user.name}</div>
                      <div>{timeAgo(new Date(r.createdAt))}</div>
                      {r.batch && <div>Batch {r.batch}</div>}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.content}</p>
                  {(r.pros || r.cons) && (
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
                      {r.pros && <div className="text-xs"><span className="text-green-600 font-medium">✓ Pros:</span> <span className="text-gray-500">{r.pros}</span></div>}
                      {r.cons && <div className="text-xs"><span className="text-red-500 font-medium">✗ Cons:</span> <span className="text-gray-500">{r.cons}</span></div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}