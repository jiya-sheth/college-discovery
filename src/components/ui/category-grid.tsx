import Link from 'next/link';

const CATEGORIES = [
  { name: 'Engineering', emoji: '⚙️', count: '500+' },
  { name: 'Medical', emoji: '🏥', count: '200+' },
  { name: 'Management', emoji: '💼', count: '300+' },
  { name: 'Arts', emoji: '🎨', count: '400+' },
  { name: 'Science', emoji: '🔬', count: '250+' },
  { name: 'Law', emoji: '⚖️', count: '100+' },
  { name: 'Commerce', emoji: '📊', count: '150+' },
];

export function CategoryGrid() {
  return (
    <div>
      <h2 className="section-title mb-4">Browse by Category</h2>
      <div className="flex gap-3 flex-wrap">
        {CATEGORIES.map((cat) => (
          <Link key={cat.name} href={`/colleges?category=${cat.name}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 transition-colors group">
            <span className="text-xl">{cat.emoji}</span>
            <div>
              <div className="text-sm font-medium text-gray-900 group-hover:text-brand-700">{cat.name}</div>
              <div className="text-xs text-gray-400">{cat.count} colleges</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}