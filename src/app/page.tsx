'use client';
import HeaderSmart from '../components/organisms/HeaderSmart';
import MenuBar from '../components/molecules/MenuBar';
import PostCard from '../components/organisms/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useQuery } from '@tanstack/react-query';
import { getFeed } from '../lib/api/feed';

export default function Home() {
  const token = useSelector((s: RootState) => s.auth.token);
  const feed = useQuery({
    queryKey: ['feed', 1, 10],
    queryFn: () => getFeed(token as string, 1, 10),
    enabled: !!token,
  });
  return (
    <main className='min-h-screen bg-black'>
      <HeaderSmart />
      <section className='mx-auto px-7xl py-7xl flex flex-col gap-4xl'>
        {feed.data?.items?.map((p) => (
          <PostCard key={p.id} variant='mobile' post={p} />
        ))}
      </section>
      <div className='fixed inset-x-0 bottom-10 flex justify-center'>
        <MenuBar />
      </div>
    </main>
  );
}
