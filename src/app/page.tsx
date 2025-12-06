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

export default function Home() {
  const token = useSelector((s: RootState) => s.auth.token);
  const user = useSelector((s: RootState) => s.auth.user);
  const ready = !!token && !!user;
  const feed = useQuery({
    queryKey: ['feed', 1, 10],
    queryFn: () => getFeed(token as string, 1, 10),
    enabled: ready,
  });
  return (
    <main className='min-h-screen bg-black'>
      <HeaderSmart />
      {useSearchParams().get('posted') === '1' && (
        <section className='mx-auto px-7xl py-md'>
          <AlertBanner variant='success' label='Success Post' />
        </section>
      )}
      {ready && (
        <section className='mx-auto px-7xl py-7xl flex flex-col gap-4xl'>
          {feed.data?.items?.map((p) => (
            <PostCard key={p.id} variant='mobile' post={p} />
          ))}
        </section>
      )}
      <div className='fixed inset-x-0 bottom-10 flex justify-center'>
        <MenuBar />
      </div>
    </main>
  );
}
