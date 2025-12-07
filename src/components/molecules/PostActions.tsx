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
    mutationFn: async () =>
      liked ? unlikePost(token, postId) : likePost(token, postId),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
  const saveMut = useMutation({
    mutationFn: async () =>
      saved ? unsavePost(token, postId) : savePost(token, postId),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-xl text-3xl cursor-pointer'>
          <button
            onClick={() => likeMut.mutate()}
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
          onClick={() => saveMut.mutate()}
        >
          <Icon
            icon={saved ? 'gravity-ui:bookmark-fill' : 'gravity-ui:bookmark'}
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
