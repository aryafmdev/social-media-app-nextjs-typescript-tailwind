'use client';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Avatar from '../atoms/Avatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getComments, addComment } from '../../lib/api/comments';
import type { Comment } from '../../lib/api/comments';
import type { Post } from '../../lib/api/posts';

dayjs.extend(relativeTime);

type Props = { open: boolean; onCloseAction: () => void; postId: string };

export default function CommentsDrawer({ open, onCloseAction, postId }: Props) {
  const token = useSelector((s: RootState) => s.auth.token) as string;
  const qc = useQueryClient();
  const comments = useQuery({
    queryKey: ['posts', postId, 'comments', 1, 20],
    queryFn: () => getComments(token ?? null, postId, 1, 20),
    enabled: open,
  });
  const [text, setText] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const mut = useMutation({
    mutationFn: async () => addComment(token, postId, text.trim()),
    onSuccess: (c) => {
      qc.setQueryData<{ items: Comment[] }>(
        ['posts', postId, 'comments', 1, 20],
        (old) => {
          const items = Array.isArray(old?.items) ? old!.items.slice(0) : [];
          items.unshift(c);
          return { items };
        }
      );

      qc.setQueriesData<{ items: Post[] }>({ queryKey: ['feed'] }, (old) => {
        if (!old || !Array.isArray(old.items)) return old;
        const items = old.items.map((p) =>
          p.id === postId
            ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 }
            : p
        );
        return { ...old, items };
      });

      qc.setQueriesData<{ items: Post[] }>(
        { queryKey: ['feed', 1, 10] },
        (old) => {
          if (!old || !Array.isArray(old.items)) return old;
          const items = old.items.map((p) =>
            p.id === postId
              ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 }
              : p
          );
          return { ...old, items };
        }
      );

      qc.setQueryData<Post>(['post', postId], (prev) =>
        prev ? { ...prev, commentsCount: (prev.commentsCount ?? 0) + 1 } : prev
      );

      qc.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });

      setText('');
      setEmojiOpen(false);
    },
  });
  const list = comments.data?.items ?? [];
  useEffect(() => {
    if (!open) return;
    const count = list.length;
    qc.setQueriesData<{ items: Post[] }>({ queryKey: ['feed'] }, (old) => {
      if (!old || !Array.isArray(old.items)) return old;
      const items = old.items.map((p) =>
        p.id === postId ? { ...p, commentsCount: count } : p
      );
      return { ...old, items };
    });
    qc.setQueriesData<{ items: Post[] }>(
      { queryKey: ['feed', 1, 10] },
      (old) => {
        if (!old || !Array.isArray(old.items)) return old;
        const items = old.items.map((p) =>
          p.id === postId ? { ...p, commentsCount: count } : p
        );
        return { ...old, items };
      }
    );
    qc.setQueryData<Post>(['post', postId], (prev) =>
      prev ? { ...prev, commentsCount: count } : prev
    );
  }, [open, postId, list.length, qc]);
  const content = open ? (
    <div className='fixed inset-0 z-50'>
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-xxs'
        onClick={onCloseAction}
      />
      <div
        className='absolute inset-x-0 bottom-0 transition-all duration-300'
        style={{
          height: '50vh',
        }}
      >
        <div className='w-full max-w-[600px] mx-auto px-4 h-full relative bg-neutral-950 rounded-xl'>
          <div className='py-md flex items-center justify-between'>
            <span className='text-neutral-25 font-bold text-md'>Comments</span>
            <button
              className='size-6 flex items-center justify-center text-neutral-300 text-xl hover:text-neutral-25'
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
                  No Comments yet
                </div>
                <div className='text-neutral-400 text-sm font-regular mt-md'>
                  Start the conversation
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-lg'>
                {list.map((cm, i) => {
                  const displayName = (
                    cm.author?.name ??
                    cm.author?.username ??
                    ''
                  ).trim();
                  const when = cm.createdAt
                    ? dayjs(cm.createdAt).fromNow()
                    : '';
                  return (
                    <div
                      key={
                        cm.id ||
                        `${cm.author?.username ?? 'u'}-${cm.createdAt ?? 't'}-${i}`
                      }
                      className='border-b border-neutral-800 pb-md'
                    >
                      <div className='flex items-center gap-md'>
                        <Avatar size={40} src={undefined} />
                        <div className='flex flex-col'>
                          <span className='text-neutral-25 font-semibold'>
                            {displayName}
                          </span>
                          <span className='text-neutral-400 text-xs'>
                            {when}
                          </span>
                        </div>
                      </div>
                      <p className='text-neutral-300 text-md mt-sm'>
                        {cm.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className='absolute flex inset-x-0 bottom-10 py-md bg-neutral-950 gap-md'>
            <div className='flex items-center bg-neutral-950 border border-neutral-800 h-[48px] px-lg rounded-xl mb-sm'>
              <button
                type='button'
                className='flex items-center text-2xl justify-center text-neutral-50 hover:text-neutral-25'
                onClick={() => setEmojiOpen((v) => !v)}
                aria-label='Emoji'
              >
                <Icon icon='fluent:emoji-24-regular' />
              </button>
            </div>
            <div className='rounded-xl w-full bg-neutral-950 border border-neutral-800 h-[48px] px-lg flex items-center gap-md'>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    text.trim().length > 0 &&
                    !mut.isPending
                  ) {
                    e.preventDefault();
                    mut.mutate();
                  }
                }}
                placeholder='Add Comment'
                className='flex-1 bg-transparent text-neutral-25 text-sm font-medium placeholder:text-neutral-500 outline-none'
              />
              <button
                type='button'
                className={`text-sm font-bold cursor-pointer ${text.trim().length > 0 ? 'text-primary-200' : 'text-neutral-600'}`}
                onClick={() => mut.mutate()}
                disabled={mut.isPending || text.trim().length === 0}
              >
                Post
              </button>
            </div>
            {emojiOpen && (
              <div className='absolute bottom-[64px] left-[24px] rounded-lg bg-neutral-950 border border-neutral-800 p-md grid grid-cols-6 gap-sm'>
                {[
                  '😀',
                  '😁',
                  '😂',
                  '😊',
                  '😍',
                  '😘',
                  '😎',
                  '😇',
                  '😉',
                  '🙂',
                  '🤗',
                  '🤩',
                  '🤔',
                  '😴',
                  '😮',
                  '😢',
                  '😭',
                  '😡',
                ].map((em) => (
                  <button
                    key={em}
                    className='text-2xl'
                    onClick={() => {
                      setText((t) => t + em);
                      setEmojiOpen(false);
                    }}
                    aria-label={`emoji-${em}`}
                  >
                    {em}
                  </button>
                ))}
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
