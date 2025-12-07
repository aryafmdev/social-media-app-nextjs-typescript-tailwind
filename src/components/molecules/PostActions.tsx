'use client';
import ActionCount from '../atoms/ActionCount';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RootState } from '../../store';
import { likePost, unlikePost } from '../../lib/api/likes';
import { savePost, unsavePost } from '../../lib/api/saves';
import CommentsDrawer from '../organisms/CommentsDrawer';

export default function PostActions({
  postId,
  liked,
  saved,
  likesCount = 0,
  commentsCount = 0,
}: {
  postId: string;
  liked?: boolean;
  saved?: boolean;
  likesCount?: number;
  commentsCount?: number;
}) {
  const token = useSelector((s: RootState) => s.auth.token) as string;
  const qc = useQueryClient();
  const [openComments, setOpenComments] = useState(false);
  const likeMut = useMutation({
    mutationFn: async (nextLiked: boolean) =>
      nextLiked ? likePost(token, postId) : unlikePost(token, postId),
    onMutate: async (nextLiked) => {
      const apply = (p: import('../../lib/api/posts').Post) => {
        const base = p.likesCount ?? 0;
        const updated = nextLiked ? base + 1 : base - 1;
        const safe = updated < 0 ? 0 : updated;
        return { ...p, liked: nextLiked, likesCount: safe };
      };
      qc.setQueriesData<{ items: import('../../lib/api/posts').Post[] }>(
        { queryKey: ['feed'] },
        (old) => {
          if (!old || !Array.isArray(old.items)) return old;
          const items = old.items.map((p) => (p.id === postId ? apply(p) : p));
          return { ...old, items };
        }
      );
      qc.setQueryData<import('../../lib/api/posts').Post>(
        ['post', postId],
        (prev) => (prev ? apply(prev) : prev)
      );
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
    },
  });
  const saveMut = useMutation({
    mutationFn: async (nextSaved: boolean) =>
      nextSaved ? savePost(token, postId) : unsavePost(token, postId),
    onMutate: async (nextSaved) => {
      const apply = (p: import('../../lib/api/posts').Post) => ({
        ...p,
        saved: nextSaved,
      });
      const feedUpdater = (
        old: { items: import('../../lib/api/posts').Post[] } | undefined
      ) => {
        if (!old || !Array.isArray(old.items)) return old;
        const items = old.items.map((p) => (p.id === postId ? apply(p) : p));
        return { ...old, items };
      };
      qc.setQueriesData<{ items: import('../../lib/api/posts').Post[] }>(
        { queryKey: ['feed'] },
        feedUpdater
      );
      qc.setQueryData<{ items: import('../../lib/api/posts').Post[] }>(
        ['feed', 1, 10],
        feedUpdater
      );
      qc.setQueryData<import('../../lib/api/posts').Post>(
        ['post', postId],
        (prev) => (prev ? apply(prev) : prev)
      );
      // Sync Tab Saved optimistically
      const feed10 = qc.getQueryData<{
        items: import('../../lib/api/posts').Post[];
      }>(['feed', 1, 10]);
      const fromFeed = feed10?.items.find((p) => p.id === postId);
      const fromDetail = qc.getQueryData<import('../../lib/api/posts').Post>([
        'post',
        postId,
      ]);
      const candidate = (fromFeed || fromDetail) as
        | import('../../lib/api/posts').Post
        | undefined;
      qc.setQueryData<{ items: import('../../lib/api/posts').Post[] }>(
        ['me', 'saved', 1, 20],
        (prev) => {
          const items = Array.isArray(prev?.items) ? [...prev!.items] : [];
          const idx = items.findIndex((it) => it.id === postId);
          if (nextSaved) {
            if (idx < 0 && candidate)
              items.unshift({ ...candidate, saved: true });
          } else {
            if (idx >= 0) items.splice(idx, 1);
          }
          return { items };
        }
      );
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({ queryKey: ['me', 'saved'] });
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({ queryKey: ['me', 'saved'] });
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
  const savedState = (() => {
    const feed10 = qc.getQueryData<{
      items: import('../../lib/api/posts').Post[];
    }>(['feed', 1, 10]);
    const fromFeed = feed10?.items.find((p) => p.id === postId)?.saved;
    const fromDetail = qc.getQueryData<import('../../lib/api/posts').Post>([
      'post',
      postId,
    ])?.saved;
    const meSavedList = qc.getQueryData<{
      items: import('../../lib/api/posts').Post[];
    }>(['me', 'saved', 1, 20]);
    const fromSavedList = meSavedList?.items?.some((it) => it.id === postId)
      ? true
      : undefined;
    return fromFeed ?? fromDetail ?? fromSavedList ?? saved ?? false;
  })();
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-xl text-3xl cursor-pointer'>
          <button
            onClick={() => {
              if (likeMut.isPending) return;
              const feed10 = qc.getQueryData<{
                items: import('../../lib/api/posts').Post[];
              }>(['feed', 1, 10]);
              const cur =
                feed10?.items.find((p) => p.id === postId)?.liked ??
                liked ??
                qc.getQueryData<import('../../lib/api/posts').Post>([
                  'post',
                  postId,
                ])?.liked ??
                false;
              const next = !cur;
              likeMut.mutate(next);
            }}
            className='text-neutral-25 cursor-pointer'
          >
            <ActionCount
              icon={liked ? 'mdi:heart' : 'mdi:heart-outline'}
              count={likesCount}
            />
          </button>
          <button
            onClick={() => setOpenComments(true)}
            className='text-neutral-25 cursor-pointer'
          >
            <ActionCount
              icon='mdi:comment-processing-outline'
              count={commentsCount}
            />
          </button>
          <ActionCount icon='lucide:send' count={0} />
        </div>
        <button
          className='text-neutral-25 text-3xl cursor-pointer'
          onClick={() => {
            if (saveMut.isPending) return;
            const next = !savedState;
            saveMut.mutate(next);
          }}
        >
          <Icon
            icon={
              savedState ? 'gravity-ui:bookmark-fill' : 'gravity-ui:bookmark'
            }
          />
        </button>
      </div>
      {openComments && (
        <CommentsDrawer
          open={openComments}
          onCloseAction={() => setOpenComments(false)}
          postId={postId}
        />
      )}
    </>
  );
}
