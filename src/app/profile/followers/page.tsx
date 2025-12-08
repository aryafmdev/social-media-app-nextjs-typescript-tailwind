'use client';
import dynamic from 'next/dynamic';
const HeaderSmart = dynamic(
  () => import('../../../components/organisms/HeaderSmart'),
  { ssr: false }
);
import ProfileTemplate from '../../../components/templates/ProfileTemplate';
import Avatar from '../../../components/atoms/Avatar';
import { Icon } from '@iconify/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getMyFollowers } from '../../../lib/api/follow';
import { followUser, unfollowUser } from '../../../lib/api/follow';
import type { Me } from '../../../lib/api/me';
import { useRouter } from 'next/navigation';
import { loadAuth } from '../../../lib/authStorage';

export default function MyFollowersPage() {
  const token = useSelector((s: RootState) => s.auth.token);
  const savedAuth = typeof window !== 'undefined' ? loadAuth() : undefined;
  const effectiveToken = token ?? savedAuth?.token ?? null;
  const router = useRouter();
  const qc = useQueryClient();
  const followers = useQuery({
    queryKey: ['me', 'followers', 1, 20],
    queryFn: () => getMyFollowers(effectiveToken as string, 1, 20),
    enabled: !!effectiveToken,
    placeholderData: (prev) => prev,
  });

  const followMut = useMutation({
    mutationFn: async ({
      username,
      next,
    }: {
      username: string;
      next: boolean;
    }) =>
      next
        ? followUser(effectiveToken as string, username)
        : unfollowUser(effectiveToken as string, username),
    onMutate: async (variables) => {
      const { username, next } = variables;
      qc.setQueryData<{
        items: { username: string; name?: string; isFollowedByMe?: boolean }[];
      }>(['me', 'followers', 1, 20], (prev) => {
        const items = Array.isArray(prev?.items) ? prev!.items.slice(0) : [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].username === username) {
            items[i] = { ...items[i], isFollowedByMe: next } as {
              username: string;
              name?: string;
              isFollowedByMe?: boolean;
            };
            break;
          }
        }
        return { items };
      });
      qc.setQueryData<Me>(['me'], (prev) => {
        if (!prev) return prev as Me | undefined;
        const cur = prev.stats?.following ?? undefined;
        const updated =
          typeof cur === 'number'
            ? Math.max(0, cur + (next ? 1 : -1))
            : undefined;
        return updated === undefined
          ? prev
          : {
              ...prev,
              stats: {
                ...(prev.stats ?? {
                  post: 0,
                  followers: 0,
                  following: 0,
                  likes: 0,
                }),
                following: updated,
              },
            };
      });
      qc.setQueryData<Me>(['me', 'header'], (prev) => {
        if (!prev) return prev as Me | undefined;
        const cur = prev.stats?.following ?? undefined;
        const updated =
          typeof cur === 'number'
            ? Math.max(0, cur + (next ? 1 : -1))
            : undefined;
        return updated === undefined
          ? prev
          : {
              ...prev,
              stats: {
                ...(prev.stats ?? {
                  post: 0,
                  followers: 0,
                  following: 0,
                  likes: 0,
                }),
                following: updated,
              },
            };
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
      qc.invalidateQueries({ queryKey: ['me', 'followers', 1, 20] });
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
      qc.invalidateQueries({ queryKey: ['me', 'followers', 1, 20] });
    },
  });

  const list = (followers.data?.items ?? []) as {
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
          <h3 className='text-neutral-25 font-semibold'>Followers</h3>
          <div className='mt-xl flex flex-col gap-lg'>
            {list.length === 0 ? (
              <div className='text-center mt-xl'>
                <div className='text-neutral-25 font-bold text-md'>
                  Tidak ada followers
                </div>
                <div className='text-neutral-400 text-sm'>
                  Belum ada yang mengikuti
                </div>
              </div>
            ) : (
              list.map((u) => {
                const displayName = (u.name ?? u.username ?? '').trim();
                const isFollowed =
                  (u as { isFollowedByMe?: boolean }).isFollowedByMe === true;
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
                        <Avatar src={(u as { avatarUrl?: string }).avatarUrl} />
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
                    {isFollowed ? (
                      <button
                        className='rounded-full border border-neutral-700 text-neutral-25 text-sm font-bold px-3xl h-[40px] flex items-center gap-sm cursor-pointer'
                        onClick={() =>
                          followMut.mutate({
                            username: u.username,
                            next: false,
                          })
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
                          followMut.mutate({ username: u.username, next: true })
                        }
                        aria-label={`follow-${u.username}`}
                      >
                        Follow
                      </button>
                    )}
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
