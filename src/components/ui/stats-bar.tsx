interface Props { colleges: number; reviews: number; questions: number; }

export function StatsBar({ colleges, reviews, questions }: Props) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: `${colleges}+`, label: 'Colleges Listed' },
            { value: `${reviews}+`, label: 'Student Reviews' },
            { value: `${questions}+`, label: 'Questions Answered' },
            { value: '50K+', label: 'Students Helped' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-brand-600">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}