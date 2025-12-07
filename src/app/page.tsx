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
import { useQuery } from '@tanstack/react-query';
import { getFeed } from '../lib/api/feed';
import { getMySaved } from '../lib/api/saves';
import { useEffect, useState, Suspense } from 'react';

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
  const feed = useQuery({
    queryKey: ['feed', 1, 10],
    queryFn: () => getFeed(token as string, 1, 10),
    enabled: ready,
  });
  const mySaved = useQuery({
    queryKey: ['me', 'saved', 1, 20],
    queryFn: () => getMySaved(token as string, 1, 20),
    enabled: ready,
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

  return (
    <main className='min-h-screen bg-black'>
      <HeaderSmart />
      {showBanner && (
        <section className='mx-auto px-xl py-md'>
          <AlertBanner variant='success' label='Success Post' />
        </section>
      )}
      {ready && feed.data?.items && feed.data.items.length > 0 && (
        <section className='mx-auto px-xl py-xl flex flex-col gap-4xl'>
          {feed.data?.items?.map((p) => {
            const savedSet = new Set(
              mySaved.data?.items?.map((it) => it.id) ?? []
            );
            const postWithSaved = {
              ...p,
              saved: p.saved ?? savedSet.has(p.id),
            } as typeof p;
            return (
              <PostCard key={p.id} variant='mobile' post={postWithSaved} />
            );
          })}
        </section>
      )}
      {ready && feed.data?.items && feed.data.items.length === 0 && (
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
