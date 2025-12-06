'use client';
import HeaderSmart from '../components/organisms/HeaderSmart';
import AlertBanner from '../components/organisms/AlertBanner';
import { useSearchParams } from 'next/navigation';
import MenuBar from '../components/molecules/MenuBar';
import PostCard from '../components/organisms/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useQuery } from '@tanstack/react-query';
import { getFeed } from '../lib/api/feed';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const token = useSelector((s: RootState) => s.auth.token);
  const ready = !!token;
  const feed = useQuery({
    queryKey: ['feed', 1, 10],
    queryFn: () => getFeed(token as string, 1, 10),
    enabled: ready,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (searchParams.get('posted') === '1') {
      const timerStart = setTimeout(() => {
        setShowBanner(true);

        const params = new URLSearchParams(searchParams.toString());
        params.delete('posted');
        router.replace(`/?${params.toString()}`);
      }, 0);

      const timerHide = setTimeout(() => setShowBanner(false), 2000);

      return () => {
        clearTimeout(timerStart);
        clearTimeout(timerHide);
      };
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
          {feed.data?.items?.map((p) => (
            <PostCard key={p.id} variant='mobile' post={p} />
          ))}
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
