'use client';
import { useState } from 'react';
import { CollegeCard } from '@/components/college/college-card';
import { CollegeCardSkeleton } from '@/components/college/college-card-skeleton';
import { EXAM_OPTIONS } from '@/lib/utils';
import { Brain, ChevronDown, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PredictorCollege {
  id: string; slug: string; name: string; location: string; city: string; state: string;
  category: string; type: string; rating: number; reviewCount: number;
  minFees: number; maxFees: number; avgPackage: number | null; placementPct: number | null;
  nirfRank: number | null; imageUrl: string | null; naacGrade: string | null;
  predictorMeta: { exam: string; minRank: number; maxRank: number; category: string | null; chance: 'High' | 'Medium' | 'Low' };
}

const chanceColors = {
  High: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-red-100 text-red-700 border-red-200',
};

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [results, setResults] = useState<PredictorCollege[] | null>(null);
  const [isApproximate, setIsApproximate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!rank || isNaN(Number(rank)) || Number(rank) < 1) {
      toast.error('Please enter a valid rank');
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ exam, rank, category });
      const res = await fetch(`/api/predictor?${params}`);
      const data = await res.json();
      setResults(data.colleges ?? []);
      setIsApproximate(data.isApproximate ?? false);
    } catch {
      toast.error('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-6xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
          <Brain className="w-4 h-4" /> AI-Powered Predictor
        </div>
        <h1 className="text-3xl font-bold text-gray-900">College Admission Predictor</h1>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">
          Enter your exam and rank to get a personalised list of colleges where you have a good chance of admission.
        </p>
      </div>

      {/* Input Form */}
      <div className="card p-6 mb-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {/* Exam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam</label>
            <div className="relative">
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="input appearance-none pr-8"
              >
                {EXAM_OPTIONS.map((e) => <option key={e}>{e}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Rank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Rank</label>
            <input
              type="number"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g. 5000"
              className="input"
              min={1}
              onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input appearance-none pr-8"
              >
                {['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="btn-primary w-full py-3 text-base"
        >
          {loading ? 'Predicting...' : '🎯 Predict My Colleges'}
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && results !== null && (
        <div>
          {isApproximate && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              No exact matches found for your rank. Showing approximate results based on available data.
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {results.length > 0 ? `${results.length} College${results.length !== 1 ? 's' : ''} Found` : 'No Results'}
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16 card">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-semibold text-gray-700">No colleges found for this rank</h3>
              <p className="text-gray-400 text-sm mt-1">Try a different exam or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((college) => (
                <div key={college.id} className="relative">
                  <div className={`absolute top-3 right-3 z-10 badge border ${chanceColors[college.predictorMeta.chance]}`}>
                    {college.predictorMeta.chance} Chance
                  </div>
                  <CollegeCard college={college} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Cards */}
      {results === null && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { emoji: '🎯', title: 'How it works', desc: 'We match your rank against historical cutoff data for each college and exam.' },
            { emoji: '📊', title: 'Chance Indicator', desc: 'High, Medium, Low chance based on where your rank falls in the historical range.' },
            { emoji: '💡', title: 'Tip', desc: 'Results are indicative. Always check official counselling portals for final cutoffs.' },
          ].map((c) => (
            <div key={c.title} className="card p-5 text-center">
              <div className="text-3xl mb-2">{c.emoji}</div>
              <div className="font-semibold text-gray-800 mb-1">{c.title}</div>
              <div className="text-gray-500 text-sm">{c.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}