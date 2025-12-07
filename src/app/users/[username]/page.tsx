'use client';
import dynamic from 'next/dynamic';
const HeaderSmart = dynamic(
  () => import('../../../components/organisms/HeaderSmart'),
  { ssr: false }
);
import ProfileTemplate from '../../../components/templates/ProfileTemplate';
import ProfileHeader from '../../../components/organisms/ProfileHeader';
import React from 'react';
import ProfileTabs, {
  ProfileTab,
} from '../../../components/molecules/ProfileTabs';
import ProfileContent from '../../../components/organisms/ProfileContent';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUser,
  getUserPosts,
  getUserLikes,
  type UserPublic,
  type PublicPost,
} from '../../../lib/api/users';

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const qc = useQueryClient();
  const user = useQuery<UserPublic>({
    queryKey: ['user', username],
    queryFn: () => getUser(username as string),
    enabled: !!username,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  const [tab, setTab] = React.useState<ProfileTab>('gallery');
  const posts = useQuery<{ items: PublicPost[] }>({
    queryKey: ['user', username, 'posts', 1, 20],
    queryFn: () => getUserPosts(username as string, 1, 20),
    enabled: !!username && tab === 'gallery',
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev,
  });
  const likes = useQuery<{ items: PublicPost[] }>({
    queryKey: ['user', username, 'likes', 1, 20],
    queryFn: () => getUserLikes(username as string, 1, 20),
    enabled: !!username && tab === 'saved',
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev,
  });
  React.useEffect(() => {
    if (!username) return;
    if (tab === 'saved') {
      qc.prefetchQuery({
        queryKey: ['user', username, 'likes', 1, 20],
        queryFn: () => getUserLikes(username as string, 1, 20),
      });
    } else {
      qc.prefetchQuery({
        queryKey: ['user', username, 'posts', 1, 20],
        queryFn: () => getUserPosts(username as string, 1, 20),
      });
    }
  }, [qc, username, tab]);
  const hasPosts = (posts.data?.items?.length ?? 0) > 0;
  return (
    <main className='min-h-screen bg-neutral-950'>
      <HeaderSmart />
      <ProfileTemplate>
        {user.isError ? (
          <div className='rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl text-center'>
            <div className='text-neutral-25 font-bold text-md'>
              User not found
            </div>
            <div className='text-neutral-400 text-sm'>Change your keyword</div>
          </div>
        ) : (
          <>
            <ProfileHeader
              name={user.data?.name}
              username={user.data?.username}
              avatarUrl={user.data?.avatarUrl}
              stats={undefined}
              onEdit={undefined}
            />
            <ProfileTabs active={tab} onChange={setTab} />
            <ProfileContent
              tab={tab}
              hasPosts={hasPosts}
              items={tab === 'saved' ? likes.data?.items : posts.data?.items}
            />
          </>
        )}
      </ProfileTemplate>
    </main>
  );
}
