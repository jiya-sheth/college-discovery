'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (q: string) => void;
}

export function SearchBar({ placeholder = 'Search...', defaultValue = '', onSearch }: Props) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 pr-16"
      />
      <button type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-600 text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-brand-700 transition-colors">
        Search
      </button>
    </form>
  );
}