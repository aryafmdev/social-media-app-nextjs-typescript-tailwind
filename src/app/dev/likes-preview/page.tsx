'use client';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import LikesDrawer from '../../../components/organisms/LikesDrawer';

export default function LikesPreviewPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const postId = 'dev-post-1';
  useEffect(() => {
    const items = [
      {
        username: 'dina',
        name: 'Dina Pratama',
        avatarUrl: '/assets/images/avatar.png',
        isFollowedByMe: true,
      },
      {
        username: 'aryo',
        name: 'Aryo Nugroho',
        avatarUrl: '/assets/images/avatar.png',
        isFollowedByMe: true,
      },
      {
        username: 'budi',
        name: 'Budi Santoso',
        avatarUrl: '/assets/images/avatar.png',
        isFollowedByMe: false,
      },
      {
        username: 'sari',
        name: 'Sari Wulandari',
        avatarUrl: '/assets/images/avatar.png',
        isFollowedByMe: false,
      },
    ];
    qc.setQueryData(['posts', postId, 'likes', 1, 20], { items });
  }, [qc]);
  return (
    <div className='min-h-screen bg-black text-neutral-25 flex items-center justify-center'>
      <button
        className='rounded-full bg-primary-300 text-neutral-25 font-bold px-5xl py-md cursor-pointer'
        onClick={() => setOpen(true)}
        aria-label='open-likes-preview'
      >
        Open Likes Preview
      </button>
      {open && (
        <LikesDrawer
          open={open}
          onCloseAction={() => setOpen(false)}
          postId={postId}
        />
      )}
    </div>
  );
}

