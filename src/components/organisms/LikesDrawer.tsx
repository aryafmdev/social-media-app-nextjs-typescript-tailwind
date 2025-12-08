'use client';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Avatar from '../atoms/Avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getPostLikes } from '../../lib/api/likes';
import { followUser, unfollowUser } from '../../lib/api/follow';
import type { Me } from '../../lib/api/me';

export default function LikesDrawer({
  open,
  onCloseAction,
  postId,
}: {
  open: boolean;
  onCloseAction?: () => void;
  postId: string;
}) {
  const token = useSelector((s: RootState) => s.auth.token) as string;
  const myUsername = useSelector((s: RootState) => s.auth.user?.username) as
    | string
    | undefined;
  const qc = useQueryClient();
  const likes = useQuery({
    queryKey: ['posts', postId, 'likes', 1, 20],
    queryFn: () => getPostLikes(postId, 1, 20, token ?? undefined),
    enabled: open,
  });

  const followMut = useMutation({
    mutationFn: async ({
      username,
      next,
    }: {
      username: string;
      next: boolean;
    }) => (next ? followUser(token, username) : unfollowUser(token, username)),
    onMutate: async (variables) => {
      const { next, username } = variables;
      qc.setQueryData<{
        items: {
          username: string;
          name?: string;
          isMe?: boolean;
          isFollowedByMe?: boolean;
          followsMe?: boolean;
        }[];
      }>(['posts', postId, 'likes', 1, 20], (prev) => {
        const items = Array.isArray(prev?.items) ? prev!.items.slice(0) : [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].username === username) {
            items[i] = { ...items[i], isFollowedByMe: next };
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
    onSuccess: (_, variables) => {
      qc.setQueryData<{
        items: {
          username: string;
          name?: string;
          isMe?: boolean;
          isFollowedByMe?: boolean;
          followsMe?: boolean;
        }[];
      }>(['posts', postId, 'likes', 1, 20], (prev) => {
        const items = Array.isArray(prev?.items) ? prev!.items.slice(0) : [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].username === variables.username) {
            items[i] = { ...items[i], isFollowedByMe: variables.next };
            break;
          }
        }
        return { items };
      });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
      qc.invalidateQueries({ queryKey: ['posts', postId, 'likes', 1, 20] });
    },
  });
  const list = Array.isArray(likes.data?.items) ? likes.data!.items : [];

  const content = open ? (
    <div className='fixed inset-0 z-50'>
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-xxs'
        onClick={onCloseAction}
      />
      <div
        className='absolute inset-x-0 bottom-0 transition-all duration-300'
        style={{ height: '50vh' }}
      >
        <div className='w-full max-w-[600px] mx-auto px-4 h-full relative bg-neutral-950 rounded-xl'>
          <div className='py-md flex items-center justify-between'>
            <span className='text-neutral-25 font-bold text-md'>Likes</span>
            <button
              className='size-6 flex items-center justify-center text-neutral-300 text-xl hover:text-neutral-25 cursor-pointer'
              onClick={onCloseAction}
              aria-label='Close'
            >
              <Icon icon='lucide:x' />
            </button>
          </div>
          <div className='pb-[88px] overflow-y-auto max-h-[calc(100%-120px)]'>
            {list.length === 0 ? (
              <div className='text-center mt-xl'>
                <div className='text-neutral-25 font-bold text-md'>
                  No Likes yet
                </div>
                <div className='text-neutral-400 text-sm font-regular mt-md'>
                  Be the first to like
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-lg'>
                {list.map((lk) => {
                  const displayName = (lk.name ?? lk.username ?? '').trim();
                  const avatar = (lk as { avatarUrl?: string }).avatarUrl;
                  const isMe =
                    lk.isMe === true ||
                    (!!myUsername && lk.username === myUsername);
                  const isFollowed = lk.isFollowedByMe === true;
                  return (
                    <div
                      key={lk.username}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-md'>
                        <Avatar src={avatar} />
                        <div className='flex flex-col'>
                          <span className='text-neutral-25 font-semibold'>
                            {displayName || lk.username}
                          </span>
                          <span className='text-neutral-400 text-sm'>
                            {lk.username}
                          </span>
                        </div>
                      </div>
                      {!isMe &&
                        (isFollowed ? (
                          <button
                            className='rounded-full border border-neutral-700 text-neutral-25 text-sm font-bold px-3xl h-[40px] flex items-center gap-sm cursor-pointer'
                            onClick={() =>
                              followMut.mutate({
                                username: lk.username,
                                next: false,
                              })
                            }
                            aria-label={`unfollow-${lk.username}`}
                          >
                            <Icon icon='gg:check-o' className='size-5' />
                            <span>Following</span>
                          </button>
                        ) : (
                          <button
                            className='rounded-full bg-primary-300 text-neutral-25 px-3xl h-[40px] text-sm font-bold cursor-pointer'
                            onClick={() =>
                              followMut.mutate({
                                username: lk.username,
                                next: true,
                              })
                            }
                            aria-label={`follow-${lk.username}`}
                          >
                            Follow
                          </button>
                        ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}
