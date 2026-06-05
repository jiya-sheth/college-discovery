'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { timeAgo } from '@/lib/utils';
import { CheckCircle, ThumbsUp, Eye, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Answer {
  id: string; content: string; upvotes: number; isAccepted: boolean; createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface Question {
  id: string; title: string; content: string; tags: string[]; views: number;
  upvotes: number; solved: boolean; createdAt: string;
  user: { id: string; name: string | null; image: string | null };
  answers: Answer[];
}

function Avatar({ name, image }: { name: string | null; image: string | null }) {
  if (image) return <img src={image} alt={name ?? ''} className="w-8 h-8 rounded-full object-cover" />;
  return (
    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-semibold">
      {(name ?? '?').charAt(0).toUpperCase()}
    </div>
  );
}

export default function DiscussionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/discussions/${id}`)
      .then((r) => r.json())
      .then(setQuestion)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    if (!session) { window.location.href = '/auth/login'; return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/discussions/${id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answer }),
      });
      if (!res.ok) throw new Error();
      const newAnswer = await res.json();
      setQuestion((q) => q ? { ...q, answers: [...q.answers, newAnswer] } : q);
      setAnswer('');
      toast.success('Answer posted!');
    } catch {
      toast.error('Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="page-container max-w-3xl animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-5/6" />
    </div>
  );

  if (!question) return <div className="page-container text-center py-20">Question not found</div>;

  return (
    <div className="page-container max-w-3xl">
      <Link href="/discussions" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Discussions
      </Link>

      {/* Question */}
      <div className="card p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{question.content}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {question.tags.map((tag) => (
            <span key={tag} className="badge bg-brand-50 text-brand-700">{tag}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {question.views}</span>
          <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {question.upvotes}</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {question.answers.length}</span>
          <div className="ml-auto flex items-center gap-2">
            <Avatar name={question.user.name} image={question.user.image} />
            <span>{question.user.name} · {timeAgo(new Date(question.createdAt))}</span>
          </div>
        </div>
      </div>

      {/* Answers */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
      </h2>

      <div className="space-y-4 mb-8">
        {question.answers.map((ans) => (
          <div key={ans.id} className={`card p-5 ${ans.isAccepted ? 'border-green-300 bg-green-50/30' : ''}`}>
            {ans.isAccepted && (
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium mb-3">
                <CheckCircle className="w-4 h-4" /> Accepted Answer
              </div>
            )}
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ans.content}</p>
            <div className="flex items-center gap-3 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {ans.upvotes}</span>
              <div className="ml-auto flex items-center gap-2">
                <Avatar name={ans.user.name} image={ans.user.image} />
                <span>{ans.user.name} · {timeAgo(new Date(ans.createdAt))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Answer */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Your Answer</h3>
        {session ? (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write a detailed answer to help others..."
              rows={5}
              className="input resize-none mb-3"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || answer.trim().length < 10}
              className="btn-primary"
            >
              {submitting ? 'Posting...' : 'Post Answer'}
            </button>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">Sign in</Link> to post an answer
          </div>
        )}
      </div>
    </div>
  );
}