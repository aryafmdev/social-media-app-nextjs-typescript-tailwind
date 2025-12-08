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
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  followUser,
  unfollowUser,
  getMyFollowing,
} from '../../../lib/api/follow';
import {
  getUser,
  getUserPosts,
  getUserLikes,
  type UserPublic,
  type PublicPost,
} from '../../../lib/api/users';

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const token = useSelector((s: RootState) => s.auth.token);
  const router = useRouter();
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
    queryKey: ['user', username, 'likes', 1, 20, token ?? null],
    queryFn: () => getUserLikes(username as string, 1, 20, token as string),
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
        queryKey: ['user', username, 'likes', 1, 20, token ?? null],
        queryFn: () => getUserLikes(username as string, 1, 20, token as string),
      });
    } else {
      qc.prefetchQuery({
        queryKey: ['user', username, 'posts', 1, 20],
        queryFn: () => getUserPosts(username as string, 1, 20),
      });
    }
  }, [qc, username, tab, token]);
  const myFollowing = useQuery<{
    items: { username: string; name?: string }[];
  }>({
    queryKey: ['me', 'following', 1, 200],
    queryFn: () => getMyFollowing(token as string, 1, 200),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  const userEx = user.data as
    | (UserPublic & { isFollowedByMe?: boolean })
    | undefined;
  const initialFollowed =
    userEx?.isFollowedByMe === true ||
    (Array.isArray(myFollowing.data?.items) &&
      !!myFollowing.data?.items.find((it) => it.username === username));
  const [isFollowed, setIsFollowed] =
    React.useState<boolean>(!!initialFollowed);
  React.useEffect(() => {
    const next =
      userEx?.isFollowedByMe === true ||
      (Array.isArray(myFollowing.data?.items) &&
        !!myFollowing.data?.items.find((it) => it.username === username));
    setIsFollowed(!!next);
  }, [userEx?.isFollowedByMe, myFollowing.data?.items, username]);
  const followMut = useMutation({
    mutationFn: async (next: boolean) =>
      next
        ? followUser(token as string, username as string)
        : unfollowUser(token as string, username as string),
    onMutate: async (next) => {
      setIsFollowed(next);
    },
    onError: () => {
      setIsFollowed((prev) => !prev);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['me', 'header'] });
      qc.invalidateQueries({ queryKey: ['me', 'following'] });
    },
  });
  const hasPosts = (posts.data?.items?.length ?? 0) > 0;
  const effectiveStats = React.useMemo(() => {
    const s = user.data?.stats;
    const postCount = Math.max(s?.post ?? 0, posts.data?.items?.length ?? 0);
    const likesCount = Math.max(s?.likes ?? 0, likes.data?.items?.length ?? 0);
    const followers = s?.followers ?? 0;
    const following = s?.following ?? 0;
    if (postCount || followers || following || likesCount)
      return { post: postCount, followers, following, likes: likesCount };
    return undefined;
  }, [user.data?.stats, posts.data?.items, likes.data?.items]);
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
              stats={effectiveStats}
              followState={{
                isFollowed,
                onToggle: (next: boolean) => {
                  if (!token) {
                    router.replace('/login');
                    return;
                  }
                  followMut.mutate(next);
                },
              }}
            />
            <ProfileTabs
              active={tab}
              onChange={setTab}
              secondLabel='Liked'
              secondActiveIcon='ph:heart-fill'
              secondInactiveIcon='ph:heart'
            />
            <ProfileContent
              tab={tab}
              hasPosts={hasPosts}
              publicView
              items={tab === 'saved' ? likes.data?.items : posts.data?.items}
            />
          </>
        )}
      </ProfileTemplate>
    </main>
  );
}
