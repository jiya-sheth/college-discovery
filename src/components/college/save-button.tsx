'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function SaveButton({ collegeId }: { collegeId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) { router.push('/auth/login'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId }),
      });
      const data = await res.json();
      setSaved(data.saved);
      toast.success(data.saved ? 'College saved!' : 'Removed from saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${
        saved
          ? 'bg-brand-600 text-white'
          : 'bg-white/80 text-gray-500 hover:bg-white hover:text-brand-600'
      }`}
      title={saved ? 'Remove from saved' : 'Save college'}
    >
      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}