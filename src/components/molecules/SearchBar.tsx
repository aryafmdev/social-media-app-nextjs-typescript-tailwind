'use client';
import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../../lib/api/users';
import Avatar from '../atoms/Avatar';
import { useRouter } from 'next/navigation';

type SearchBarProps = {
  placeholder?: string;
  onCloseAction?: () => void;
};

export default function SearchBar({
  placeholder = 'Search',
  onCloseAction,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const router = useRouter();
  useEffect(() => {
    const h = setTimeout(() => setDebounced(query.trim()), 200);
    return () => clearTimeout(h);
  }, [query]);
  const res = useQuery({
    queryKey: ['users', 'search', debounced, 1, 20],
    queryFn: () => searchUsers(debounced, 1, 20),
    enabled: debounced.length > 0,
  });

  const tokens = useMemo(
    () => debounced.split(/\s+/).filter((t) => t.length > 0),
    [debounced]
  );
  const score = useCallback(
    (text: string): number => {
      const t = text.toLowerCase();
      let s = 0;
      for (const tok of tokens) {
        const k = tok.toLowerCase().replace(/^#/, '');
        if (!k) continue;
        if (t.startsWith(k)) s += 5;
        if (t.includes(k)) s += 3;
        let i = 0;
        let j = 0;
        const a = t;
        const b = k;
        while (i < a.length && j < b.length) {
          if (a[i] === b[j]) j++;
          i++;
        }
        if (j === b.length) s += 2;
      }
      return s;
    },
    [tokens]
  );
  const ranked = useMemo(() => {
    const items = res.data?.items ?? [];
    const scored = items.map((u) => {
      const name = (u.name ?? '').toLowerCase();
      const uname = (u.username ?? '').toLowerCase();
      const base = score(name) + score(uname);
      return { u, s: base };
    });
    return scored.sort((a, b) => b.s - a.s).map((it) => it.u);
  }, [res.data?.items, score]);

  const topSuggestion = ranked.length > 0 ? ranked[0] : undefined;

  return (
    <div className='relative flex items-center w-full h-6xl px-lg gap-md'>
      <div className='flex items-center flex-1 h-full bg-neutral-900 rounded-full px-lg py-sm md:w-[clamp(363px,34vw,1309px)]'>
        <Icon icon='lucide:search' className='text-neutral-400 size-5 mr-sm' />
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (topSuggestion?.username)
                router.push(`/users/${topSuggestion.username}`);
            }
          }}
          className='flex-1 bg-transparent text-neutral-25 placeholder:text-neutral-500 outline-none'
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label='clear-query'>
            <Icon
              icon='lucide:x'
              className='text-neutral-950 bg-neutral-600 rounded-full size-5'
            />
          </button>
        )}
      </div>

      {onCloseAction && (
        <button onClick={onCloseAction} aria-label='close-search'>
          <Icon icon='lucide:x' className='text-primary-100 size-6 md:hidden' />
        </button>
      )}

      {debounced.length > 0 && (
        <div className='absolute h-screen flex items-center justify-center top-full left-0 w-full bg-black px-xl py-xl'>
          {ranked.length === 0 ? (
            <div className='text-center py-2xl'>
              <div className='text-neutral-25 font-bold text-md'>
                No results found
              </div>
              <div className='text-neutral-400 text-sm'>
                Change your keyword
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-md'>
              {ranked.map((u) => (
                <button
                  key={u.username}
                  className='rounded-xl p-xl flex items-center gap-md text-left bg-black'
                  onClick={() => router.push(`/users/${u.username}`)}
                >
                  <Avatar src={u.avatarUrl} />
                  <div className='flex flex-col'>
                    <span className='text-neutral-25 font-semibold'>
                      {u.name ?? u.username}
                    </span>
                    <span className='text-neutral-400 text-sm'>
                      {u.username}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
