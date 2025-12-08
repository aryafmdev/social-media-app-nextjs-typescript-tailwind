'use client';
import dynamic from 'next/dynamic';
const HeaderSmart = dynamic(
  () => import('../../../../components/organisms/HeaderSmart'),
  { ssr: false }
);
import ProfileTemplate from '../../../../components/templates/ProfileTemplate';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getUserLikes } from '../../../../lib/api/users';

export default function UserLikesPage() {
  const { username } = useParams<{ username: string }>();
  const token = useSelector((s: RootState) => s.auth.token);
  const router = useRouter();
  const likes = useQuery({
    queryKey: ['user', username, 'likes', 1, 20, token ? 'auth' : 'anon'],
    queryFn: () => getUserLikes(username as string, 1, 20, token ?? undefined),
    enabled: !!username,
    placeholderData: (prev) => prev,
  });
  const list = (likes.data?.items ?? []) as { id: string; imageUrl?: string }[];
  return (
    <main className='min-h-screen bg-neutral-950'>
      <HeaderSmart />
      <ProfileTemplate>
        <div className='p-3xl'>
          <h3 className='text-neutral-25 font-semibold'>Likes</h3>
          {list.length === 0 ? (
            <div className='text-center mt-xl'>
              <div className='text-neutral-25 font-bold text-md'>
                Belum ada likes
              </div>
              <div className='text-neutral-400 text-sm'>
                Tidak ada post yang di-like
              </div>
            </div>
          ) : (
            <div className='mt-xl grid grid-cols-3 gap-xs'>
              {list
                .filter(
                  (p) =>
                    typeof p.imageUrl === 'string' &&
                    p.imageUrl!.trim().length > 0
                )
                .map((p) => (
                  <div
                    key={p.id}
                    className='rounded-xs overflow-hidden h-[110px] relative cursor-pointer'
                    onClick={() => router.push(`/posts/${p.id}`)}
                  >
                    <Image
                      src={p.imageUrl as string}
                      alt='liked image'
                      fill
                      sizes='(min-width: 768px) 33vw, 100vw'
                      className='object-cover cursor-pointer'
                      unoptimized
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </ProfileTemplate>
    </main>
  );
}
