'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { MessageSquare, Plus, Search, TrendingUp, Clock, HelpCircle } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { NewQuestionModal } from '@/components/discussions/new-question-modal';
import { Pagination } from '@/components/ui/pagination';

interface Question {
  id: string; title: string; content: string; tags: string[]; views: number;
  upvotes: number; solved: boolean; createdAt: string;
  user: { id: string; name: string | null; image: string | null };
  _count: { answers: number };
}

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest', icon: Clock },
  { value: 'popular', label: 'Popular', icon: TrendingUp },
  { value: 'unanswered', label: 'Unanswered', icon: HelpCircle },
];

export default function DiscussionsPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, page: String(page), limit: '10' });
      if (search) params.set('q', search);
      const res = await fetch(`/api/discussions?${params}`);
      const data = await res.json();
      setQuestions(data.questions ?? []);
      setPagination(data.pagination ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [sort, page, search]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
          <p className="text-gray-500 mt-1">Ask questions, share knowledge, help others decide</p>
        </div>
        <button
          onClick={() => session ? setShowModal(true) : window.location.href = '/auth/login'}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ask Question
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => { setSort(o.value); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sort === o.value ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <o.icon className="w-3.5 h-3.5" />
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 card">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">No questions yet</h3>
          <p className="text-gray-400 text-sm mt-1">Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Link key={q.id} href={`/discussions/${q.id}`} className="card p-5 flex gap-4 hover:shadow-md transition-shadow block">
              {/* Vote/Answer counts */}
              <div className="flex flex-col items-center gap-2 text-center shrink-0 w-16">
                <div className={`text-sm font-semibold ${q._count.answers > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {q._count.answers}
                  <div className="text-xs font-normal">{q._count.answers === 1 ? 'answer' : 'answers'}</div>
                </div>
                <div className="text-xs text-gray-400">{q.views} views</div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2 flex-1">
                    {q.title}
                  </h3>
                  {q.solved && (
                    <span className="badge bg-green-100 text-green-700 shrink-0">Solved</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{q.content}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {q.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="badge bg-brand-50 text-brand-700">{tag}</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-auto shrink-0">
                    {q.user.name} · {timeAgo(new Date(q.createdAt))}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}

      {showModal && (
        <NewQuestionModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); fetchQuestions(); }}
        />
      )}
    </div>
  );
}