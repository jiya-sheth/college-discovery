import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CollegeCard } from '@/components/college/college-card';
import { HeroSearch } from '@/components/ui/hero-search';
import { StatsBar } from '@/components/ui/stats-bar';
import { CategoryGrid } from '@/components/ui/category-grid';
import { BookOpen, TrendingUp, GitCompare, Brain } from 'lucide-react';

async function getFeaturedColleges() {
  return prisma.college.findMany({
    orderBy: { rating: 'desc' },
    take: 6,
    select: {
      id: true, slug: true, name: true, location: true, city: true, state: true,
      type: true, category: true, rating: true, reviewCount: true,
      minFees: true, maxFees: true, nirfRank: true, imageUrl: true, logoUrl: true,
      avgPackage: true, placementPct: true, naacGrade: true,
    },
  });
}

async function getStats() {
  const [colleges, reviews, questions] = await Promise.all([
    prisma.college.count(),
    prisma.review.count(),
    prisma.question.count(),
  ]);
  return { colleges, reviews, questions };
}

export default async function HomePage() {
  const [colleges, stats] = await Promise.all([getFeaturedColleges(), getStats()]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptNiAwaDZ2LTZoLTZ2NnptLTEyIDBoLTZ2Nmg2di02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative page-container py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Trusted by 50,000+ students</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Find Your Perfect<br />
            <span className="text-yellow-300">College in India</span>
          </h1>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Compare colleges, predict admissions, read real reviews — everything you need to make the right decision.
          </p>
          <HeroSearch />
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-white/70">
            <span>Popular:</span>
            {['IIT Bombay', 'BITS Pilani', 'IIM Ahmedabad', 'AIIMS Delhi'].map((name) => (
              <Link key={name} href={`/colleges?q=${encodeURIComponent(name)}`} className="hover:text-white underline underline-offset-2 transition-colors">
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsBar colleges={stats.colleges} reviews={stats.reviews} questions={stats.questions} />

      {/* Features */}
      <section className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, title: 'College Listings', desc: 'Browse 1000+ colleges with filters', href: '/colleges', color: 'bg-blue-50 text-blue-600' },
            { icon: GitCompare, title: 'Compare Colleges', desc: 'Side-by-side comparison tool', href: '/compare', color: 'bg-purple-50 text-purple-600' },
            { icon: Brain, title: 'Rank Predictor', desc: 'Find colleges based on your rank', href: '/predictor', color: 'bg-green-50 text-green-600' },
            { icon: TrendingUp, title: 'Discussions', desc: 'Ask questions, get answers', href: '/discussions', color: 'bg-orange-50 text-orange-600' },
          ].map((f) => (
            <Link key={f.title} href={f.href} className="card p-5 flex gap-4 items-start group cursor-pointer">
              <div className={`p-2.5 rounded-xl ${f.color} shrink-0 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{f.title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories */}
        <CategoryGrid />

        {/* Featured Colleges */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Top Rated Colleges</h2>
              <p className="text-gray-500 text-sm mt-1">Based on student reviews and placement data</p>
            </div>
            <Link href="/colleges" className="btn-secondary text-sm">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-brand-600 to-indigo-600 mx-4 md:mx-8 rounded-3xl p-10 text-white text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Not sure which college to pick?</h2>
        <p className="text-white/80 mb-6">Enter your exam rank and get personalised college recommendations instantly.</p>
        <Link href="/predictor" className="inline-block bg-white text-brand-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          Try Rank Predictor →
        </Link>
      </section>
    </div>
  );
}