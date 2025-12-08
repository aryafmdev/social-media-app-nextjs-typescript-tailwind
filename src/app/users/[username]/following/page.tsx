'use client';
import dynamic from 'next/dynamic';
const HeaderSmart = dynamic(
  () => import('../../../../components/organisms/HeaderSmart'),
  { ssr: false }
);
import ProfileTemplate from '../../../../components/templates/ProfileTemplate';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFollowing, getMyFollowing } from '../../../../lib/api/follow';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { followUser, unfollowUser } from '../../../../lib/api/follow';
import Avatar from '../../../../components/atoms/Avatar';
import { Icon } from '@iconify/react';
import { loadAuth } from '../../../../lib/authStorage';

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>();
  const token = useSelector((s: RootState) => s.auth.token);
  const router = useRouter();
  const qc = useQueryClient();
  const res = useQuery({
    queryKey: ['following', username, 1, 20, token ? 'auth' : 'anon'],
    queryFn: () => getFollowing(username as string, 1, 20, token ?? undefined),
    enabled: !!username,
    placeholderData: (prev) => prev,
  });
  const myFollowing = useQuery({
    queryKey: ['me', 'following', 1, 200],
    queryFn: () => getMyFollowing(token as string, 1, 200),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  const savedAuth = typeof window !== 'undefined' ? loadAuth() : undefined;
  const myUsername = savedAuth?.user?.username ?? '';
  const followMut = useMutation({
    mutationFn: async ({ uname, next }: { uname: string; next: boolean }) =>
      next
        ? followUser(token as string, uname)
        : unfollowUser(token as string, uname),
    onMutate: async ({ uname, next }) => {
      qc.setQueryData<{
        items: {
          username: string;
          name?: string;
          isFollowedByMe?: boolean;
          avatarUrl?: string;
        }[];
      }>(['following', username, 1, 20, token ? 'auth' : 'anon'], (prev) => {
        const items = Array.isArray(prev?.items) ? [...prev!.items] : [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].username === uname) {
            items[i] = { ...items[i], isFollowedByMe: next };
            break;
          }
        }
        return { items };
      });
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['following', username] });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['following', username] });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
    },
  });
  const list = (res.data?.items ?? []) as {
    username: string;
    name?: string;
    isFollowedByMe?: boolean;
    avatarUrl?: string;
  }[];
  return (
    <main className='min-h-screen bg-neutral-950'>
      <HeaderSmart />
      <ProfileTemplate>
        <div className='p-3xl'>
          <h3 className='text-neutral-25 font-semibold'>Following</h3>
          <div className='mt-xl flex flex-col gap-lg'>
            {list.length === 0 ? (
              <div className='text-center mt-xl'>
                <div className='text-neutral-25 font-bold text-md'>Kosong</div>
                <div className='text-neutral-400 text-sm'>
                  Belum mengikuti siapapun
                </div>
              </div>
            ) : (
              list.map((u) => {
                const displayName = (u.name ?? u.username ?? '').trim();
                const isFollowed =
                  (u.isFollowedByMe ?? false) === true ||
                  (Array.isArray(myFollowing.data?.items) &&
                    myFollowing.data!.items.some(
                      (it) => it.username === u.username
                    ));
                const isMe = !!myUsername && u.username === myUsername;
                return (
                  <div
                    key={u.username}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-md'>
                      <button
                        type='button'
                        onClick={() => router.push(`/users/${u.username}`)}
                        aria-label={`go-${u.username}`}
                        className='cursor-pointer'
                      >
                        <Avatar src={u.avatarUrl} />
                      </button>
                      <div className='flex flex-col'>
                        <span
                          className='text-neutral-25 font-semibold cursor-pointer'
                          onClick={() => router.push(`/users/${u.username}`)}
                        >
                          {displayName || u.username}
                        </span>
                        <span className='text-neutral-400 text-sm'>
                          {u.username}
                        </span>
                      </div>
                    </div>
                    {token ? (
                      isMe ? (
                        <button
                          className='rounded-full border border-neutral-700 text-neutral-25 text-sm font-bold px-3xl h-[40px] flex items-center gap-sm'
                          aria-label={`friend-following-${u.username}`}
                          disabled
                        >
                          <Icon icon='gg:check-o' className='size-5' />
                          <span>Following</span>
                        </button>
                      ) : isFollowed ? (
                        <button
                          className='rounded-full border border-neutral-700 text-neutral-25 text-sm font-bold px-3xl h-[40px] flex items-center gap-sm cursor-pointer'
                          onClick={() =>
                            followMut.mutate({ uname: u.username, next: false })
                          }
                          aria-label={`unfollow-${u.username}`}
                        >
                          <Icon icon='gg:check-o' className='size-5' />
                          <span>Following</span>
                        </button>
                      ) : (
                        <button
                          className='rounded-full bg-primary-300 text-neutral-25 px-3xl h-[40px] text-sm font-bold cursor-pointer'
                          onClick={() =>
                            followMut.mutate({ uname: u.username, next: true })
                          }
                          aria-label={`follow-${u.username}`}
                        >
                          Follow
                        </button>
                      )
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ProfileTemplate>
    </main>
  );
}
