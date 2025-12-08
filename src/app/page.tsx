'use client';
import dynamic from 'next/dynamic';
const HeaderSmart = dynamic(
  () => import('../components/organisms/HeaderSmart'),
  { ssr: false }
);
import AlertBanner from '../components/organisms/AlertBanner';
import { useSearchParams, useRouter } from 'next/navigation';
import MenuBar from '../components/molecules/MenuBar';
import PostCard from '../components/organisms/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getFeed } from '../lib/api/feed';
import { getMySaved } from '../lib/api/saves';
import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { getMe } from '../lib/api/me';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const token = useSelector((s: RootState) => s.auth.token);
  const ready = !!token;
  const LIMIT = 10;
  const feed = useInfiniteQuery({
    queryKey: ['feed', LIMIT],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getFeed(token as string, pageParam as number, LIMIT),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.items.length === LIMIT ? allPages.length + 1 : undefined,
    enabled: ready,
  });
  const mySaved = useQuery({
    queryKey: ['me', 'saved', 1, 20],
    queryFn: () => getMySaved(token as string, 1, 20),
    enabled: ready,
  });
  const me = useQuery({
    queryKey: ['me', 'profile'],
    queryFn: () => getMe(token as string),
    enabled: ready,
    staleTime: 0,
    placeholderData: (prev) => prev,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (searchParams.get('posted') === '1') {
      const timerShow = setTimeout(() => {
        setShowBanner(true);
        const timerHide = setTimeout(() => {
          setShowBanner(false);
        }, 1000);
        const params = new URLSearchParams(searchParams.toString());
        params.delete('posted');
        router.replace(`/?${params.toString()}`);
        return () => clearTimeout(timerHide);
      }, 0);
      return () => clearTimeout(timerShow);
    }
  }, [searchParams, router]);

  const items = useMemo(() => {
    const pages = feed.data?.pages ?? [];
    const flat = pages.flatMap((p) => p.items);
    const savedSet = new Set(mySaved.data?.items?.map((it) => it.id) ?? []);
    return flat.map((p) => ({ ...p, saved: p.saved ?? savedSet.has(p.id) }));
  }, [feed.data?.pages, mySaved.data?.items]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = feed;
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <main className='min-h-screen bg-black'>
      <HeaderSmart />
      {showBanner && (
        <section className='mx-auto px-xl py-md'>
          <AlertBanner variant='success' label='Success Post' />
        </section>
      )}
      {ready && items.length > 0 && (
        <section className='mx-auto px-xl py-xl flex flex-col gap-4xl'>
          {items.map((p) => (
            <PostCard key={p.id} variant='mobile' post={p} />
          ))}
          <div ref={sentinelRef} />
          {feed.isFetchingNextPage && (
            <div className='text-center text-neutral-400'>Loading...</div>
          )}
        </section>
      )}
      {ready &&
        feed.isSuccess &&
        me.isSuccess &&
        items.length === 0 &&
        (me.data?.stats?.following ?? 0) === 0 && (
          <section className='mx-auto px-xl py-xl'>
            <div className='rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl text-center'>
              <p className='text-neutral-300'>
                Belum follow siapapun. Cari dan follow untuk lihat feed.
              </p>
            </div>
          </section>
        )}
      {ready &&
        feed.isSuccess &&
        me.isSuccess &&
        items.length === 0 &&
        (me.data?.stats?.following ?? 0) > 0 && (
          <section className='mx-auto px-xl py-xl'>
            <div className='rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl text-center'>
              <p className='text-neutral-300'>
                Belum ada post. Ayo buat posting pertamamu!
              </p>
            </div>
          </section>
        )}
      <div className='fixed inset-x-0 bottom-10 flex justify-center'>
        <MenuBar />
      </div>
    </main>
  );
}
