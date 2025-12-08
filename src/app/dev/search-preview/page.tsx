'use client';
import Avatar from '../../../components/atoms/Avatar';
import dynamic from 'next/dynamic';
const HeaderSmart = dynamic(
  () => import('../../../components/organisms/HeaderSmart'),
  { ssr: false }
);

type Item = { username: string; name?: string; avatarUrl?: string };

export default function SearchPreviewPage() {
  const items: Item[] = Array.from({ length: 5 }).map(() => ({
    username: 'johndoe',
    name: 'John Doe',
    avatarUrl: '/assets/images/avatar.png',
  }));

  return (
    <main className='min-h-screen bg-black'>
      <HeaderSmart />
      <div className='w-full max-w-[600px] mx-auto px-4 py-xl'>
        <div className='flex flex-col gap-sm'>
          {items.map((u, i) => (
            <div
              key={`${u.username}-${i}`}
              className='rounded-xl p-xl flex items-center gap-md text-left bg-black'
            >
              <Avatar src={u.avatarUrl} />
              <div className='flex flex-col'>
                <span className='text-neutral-25 font-semibold'>
                  {u.name ?? u.username}
                </span>
                <span className='text-neutral-400 text-sm'>{u.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
