'use client';
import { Icon } from '@iconify/react';
import { useState } from 'react';

type SearchBarProps = {
  placeholder?: string;
  onCloseAction?: () => void;
};

export default function SearchBar({ placeholder = 'Search', onCloseAction }: SearchBarProps) {
  const [query, setQuery] = useState('');

  return (
    <div className="flex items-center w-full h-6xl px-lg gap-md">
      {/* Search bar utama */}
      <div className="flex items-center flex-1 h-full bg-neutral-900 rounded-full px-lg py-sm md:w-[clamp(363px,34.09vw,491px)]">
        <Icon icon="lucide:search" className="text-neutral-400 size-5 mr-sm" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-neutral-25 placeholder:text-neutral-500 outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')}>
            <Icon icon="lucide:x" className="text-neutral-950 bg-neutral-600 rounded-full size-5" />
          </button>
        )}
      </div>

      {/* Icon X besar di luar search bar */}
      {onCloseAction && (
        <button onClick={onCloseAction}>
          <Icon icon="lucide:x" className="text-primary-100 size-6 md:hidden" />
        </button>
      )}
    </div>
  );
}
