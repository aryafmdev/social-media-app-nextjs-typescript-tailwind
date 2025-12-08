'use client';
import ActionCount from '../atoms/ActionCount';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '../../store';
import { likePost, unlikePost, getPostLikes } from '../../lib/api/likes';
import { savePost, unsavePost } from '../../lib/api/saves';
import CommentsDrawer from '../organisms/CommentsDrawer';
import LikesDrawer from '../organisms/LikesDrawer';

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
  const myUsername = useSelector((s: RootState) => s.auth.user?.username) as
    | string
    | undefined;
  const [openComments, setOpenComments] = useState(false);
  const [openLikes, setOpenLikes] = useState(false);
  useEffect(() => {
    const lkKey = `sociality_like_${postId}`;
    const svKey = `sociality_saved_${postId}`;
    let lkRaw =
      typeof window !== 'undefined' ? window.localStorage.getItem(lkKey) : null;
    let svRaw =
      typeof window !== 'undefined' ? window.localStorage.getItem(svKey) : null;
    let lkVal =
      lkRaw === '1' || lkRaw === 'true'
        ? true
        : lkRaw === '0' || lkRaw === 'false'
          ? false
          : undefined;
    let svVal =
      svRaw === '1' || svRaw === 'true'
        ? true
        : svRaw === '0' || svRaw === 'false'
          ? false
          : undefined;
    if (lkVal === undefined || svVal === undefined) {
      const feed10 = qc.getQueryData<{
        items: import('../../lib/api/posts').Post[];
      }>(['feed', 1, 10]);
      const fromFeed = feed10?.items.find((p) => p.id === postId);
      const fromDetail = qc.getQueryData<import('../../lib/api/posts').Post>([
        'post',
        postId,
      ]);
      const meLikesList = qc.getQueryData<{
        items: import('../../lib/api/posts').Post[];
      }>(['me', 'likes', 1, 20]);
      const likedCandidate =
        fromFeed?.liked ??
        fromDetail?.liked ??
        (meLikesList?.items?.some((it) => it.id === postId)
          ? true
          : undefined) ??
        liked;
      const meSavedList = qc.getQueryData<{
        items: import('../../lib/api/posts').Post[];
      }>(['me', 'saved', 1, 20]);
      const savedCandidate =
        fromFeed?.saved ??
        fromDetail?.saved ??
        (meSavedList?.items?.some((it) => it.id === postId)
          ? true
          : undefined) ??
        saved;
      if (lkVal === undefined && typeof likedCandidate === 'boolean') {
        if (typeof window !== 'undefined')
          window.localStorage.setItem(lkKey, likedCandidate ? '1' : '0');
        lkRaw = likedCandidate ? '1' : '0';
        lkVal = likedCandidate;
      }
      if (svVal === undefined && typeof savedCandidate === 'boolean') {
        if (typeof window !== 'undefined')
          window.localStorage.setItem(svKey, savedCandidate ? '1' : '0');
        svRaw = savedCandidate ? '1' : '0';
        svVal = savedCandidate;
      }
    }
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const isDetail = path.startsWith('/posts/');
    if (isDetail && lkVal === undefined) {
      (async () => {
        try {
          const r = await getPostLikes(postId, 1, 20, token ?? undefined);
          const found = Array.isArray(r.items)
            ? r.items.some(
                (u) =>
                  u.isMe === true || (!!myUsername && u.username === myUsername)
              )
            : false;
          if (found && typeof window !== 'undefined') {
            window.localStorage.setItem(lkKey, '1');
            lkVal = true;
          }
        } catch {}
        const apply = (p: import('../../lib/api/posts').Post) => ({
          ...p,
          liked: lkVal ?? p.liked,
          saved: svVal ?? p.saved,
        });
        qc.setQueriesData<{ items: import('../../lib/api/posts').Post[] }>(
          { queryKey: ['feed'] },
          (old) => {
            if (!old || !Array.isArray(old.items)) return old;
            const items = old.items.map((p) =>
              p.id === postId ? apply(p) : p
            );
            return { ...old, items };
          }
        );
        qc.setQueryData<import('../../lib/api/posts').Post>(
          ['post', postId],
          (prev) => (prev ? apply(prev) : prev)
        );
      })();
      return;
    }
    if (lkVal === undefined && svVal === undefined) return;
    const apply = (p: import('../../lib/api/posts').Post) => ({
      ...p,
      liked: lkVal ?? p.liked,
      saved: svVal ?? p.saved,
    });
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
  }, [qc, postId, token, myUsername, liked, saved]);
  const likeMut = useMutation({
    mutationFn: async (nextLiked: boolean) =>
      nextLiked ? likePost(token, postId) : unlikePost(token, postId),
    onMutate: async (nextLiked) => {
      const k = `sociality_like_${postId}`;
      if (typeof window !== 'undefined')
        window.localStorage.setItem(k, nextLiked ? '1' : '0');
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
        ['me', 'likes', 1, 20],
        (prev) => {
          const items = Array.isArray(prev?.items) ? [...prev!.items] : [];
          const idx = items.findIndex((it) => it.id === postId);
          if (nextLiked) {
            if (idx < 0 && candidate)
              items.unshift({ ...candidate, liked: true });
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
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
      qc.invalidateQueries({ queryKey: ['me', 'likes', 1, 20] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
      qc.invalidateQueries({ queryKey: ['me', 'likes', 1, 20] });
    },
  });
  const saveMut = useMutation({
    mutationFn: async (nextSaved: boolean) =>
      nextSaved ? savePost(token, postId) : unsavePost(token, postId),
    onMutate: async (nextSaved) => {
      const k = `sociality_saved_${postId}`;
      if (typeof window !== 'undefined')
        window.localStorage.setItem(k, nextSaved ? '1' : '0');
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
    const k = `sociality_saved_${postId}`;
    const raw =
      typeof window !== 'undefined' ? window.localStorage.getItem(k) : null;
    const localVal =
      raw === '1' || raw === 'true'
        ? true
        : raw === '0' || raw === 'false'
          ? false
          : undefined;
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
    return (
      localVal ?? fromFeed ?? fromDetail ?? fromSavedList ?? saved ?? false
    );
  })();
  const likedState = (() => {
    const k = `sociality_like_${postId}`;
    const raw =
      typeof window !== 'undefined' ? window.localStorage.getItem(k) : null;
    const localVal =
      raw === '1' || raw === 'true'
        ? true
        : raw === '0' || raw === 'false'
          ? false
          : undefined;
    const feed10 = qc.getQueryData<{
      items: import('../../lib/api/posts').Post[];
    }>(['feed', 1, 10]);
    const fromFeed = feed10?.items.find((p) => p.id === postId)?.liked;
    const fromDetail = qc.getQueryData<import('../../lib/api/posts').Post>([
      'post',
      postId,
    ])?.liked;
    const meLikesList = qc.getQueryData<{
      items: import('../../lib/api/posts').Post[];
    }>(['me', 'likes', 1, 20]);
    const fromLikesList = meLikesList?.items?.some((it) => it.id === postId)
      ? true
      : undefined;
    return (
      localVal ?? fromFeed ?? fromDetail ?? fromLikesList ?? liked ?? false
    );
  })();
  const likesCountState = (() => {
    const feed10 = qc.getQueryData<{
      items: import('../../lib/api/posts').Post[];
    }>(['feed', 1, 10]);
    const fromFeed = feed10?.items.find((p) => p.id === postId)?.likesCount;
    const fromDetail = qc.getQueryData<import('../../lib/api/posts').Post>([
      'post',
      postId,
    ])?.likesCount;
    return fromFeed ?? fromDetail ?? likesCount ?? 0;
  })();
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-xl text-3xl cursor-pointer'>
          <button
            onClick={() => {
              if (likeMut.isPending) return;
              const next = !likedState;
              likeMut.mutate(next);
            }}
            className='text-neutral-25 cursor-pointer'
          >
            <ActionCount
              icon={likedState ? 'mdi:heart' : 'mdi:heart-outline'}
              count={likesCountState}
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

        <div className='flex justify-between gap-xl'>
          <button
            className='text-neutral-25 px-lg py-xs text-xl cursor-pointer'
            onClick={() => setOpenLikes(true)}
            aria-label='open-likes'
          >
            {likesCountState} Likes
          </button>

          {openComments && (
            <CommentsDrawer
              open={openComments}
              onCloseAction={() => setOpenComments(false)}
              postId={postId}
            />
          )}
          {openLikes && (
            <LikesDrawer
              open={openLikes}
              onCloseAction={() => setOpenLikes(false)}
              postId={postId}
            />
          )}

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
      </div>
    </>
  );
}
