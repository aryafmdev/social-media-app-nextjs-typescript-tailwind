'use client';
import HeaderSmart from '../../../components/organisms/HeaderSmart';
import ProfileTemplate from '../../../components/templates/ProfileTemplate';
import ProfileHeader from '../../../components/organisms/ProfileHeader';
import React from 'react';
import ProfileTabs, {
  ProfileTab,
} from '../../../components/molecules/ProfileTabs';
import ProfileContent from '../../../components/organisms/ProfileContent';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUser, getUserPosts, getUserLikes } from '../../../lib/api/users';

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const user = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username as string),
    enabled: !!username,
  });
  const [tab, setTab] = React.useState<ProfileTab>('gallery');
  const posts = useQuery({
    queryKey: ['user', username, 'posts', 1, 20],
    queryFn: () => getUserPosts(username as string, 1, 20),
    enabled: !!username && tab === 'gallery',
  });
  const likes = useQuery({
    queryKey: ['user', username, 'likes', 1, 20],
    queryFn: () => getUserLikes(username as string, 1, 20),
    enabled: !!username && tab === 'liked',
  });
  const hasPosts = (posts.data?.items?.length ?? 0) > 0;
  return (
    <main className='min-h-screen bg-neutral-950'>
      <HeaderSmart />
      <ProfileTemplate>
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
          items={tab === 'liked' ? likes.data?.items : posts.data?.items}
        />
      </ProfileTemplate>
    </main>
  );
}
