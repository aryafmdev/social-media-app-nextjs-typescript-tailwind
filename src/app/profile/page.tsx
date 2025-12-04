'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Header from '../../components/organisms/Header';
import ProfileTemplate from '../../components/templates/ProfileTemplate';
import ProfileHeader from '../../components/organisms/ProfileHeader';
import ProfileTabs, {
  ProfileTab,
} from '../../components/molecules/ProfileTabs';
import ProfileContent from '../../components/organisms/ProfileContent';
import MenuBar from '../../components/molecules/MenuBar';
import { RootState } from '../../store';
import { useQuery } from '@tanstack/react-query';
import { getMe, getMyPosts } from '../../lib/api/me';
import ProfileEditForm from '../../components/molecules/ProfileEditForm';

export default function ProfilePage() {
  const token = useSelector((s: RootState) => s.auth.token);
  const router = useRouter();
  const [tab, setTab] = useState<ProfileTab>('gallery');
  const [hasPostsOverride, setHasPostsOverride] = useState<boolean | null>(
    null
  );
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

  const [isMdUp, setIsMdUp] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsMdUp(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(token as string),
    enabled: !!token,
  });
  const posts = useQuery({
    queryKey: ['me', 'posts', 1, 20],
    queryFn: () => getMyPosts(token as string, 1, 20),
    enabled: !!token,
  });
  const hasPosts = (hasPostsOverride ??
    (me.data?.stats?.post ?? 0) > 0) as boolean;

  return (
    <main className='min-h-screen bg-neutral-950'>
      <Header variant={isMdUp ? 'after-login' : 'mobile-profile'} />
      <ProfileTemplate>
        <ProfileHeader
          name={me.data?.name}
          username={me.data?.username}
          avatarUrl={me.data?.avatarUrl}
          stats={me.data?.stats}
          onEdit={() => setEditing((v) => !v)}
        />
        <ProfileTabs active={tab} onChange={setTab} />
        <ProfileContent
          tab={tab}
          hasPosts={hasPosts}
          onUpload={() => setHasPostsOverride(true)}
          items={posts.data?.items}
        />
        {editing && me.data && (
          <ProfileEditForm
            me={me.data}
            onDoneAction={() => setEditing(false)}
          />
        )}
      </ProfileTemplate>
      <div className='fixed inset-x-0 bottom-10 flex justify-center'>
        <MenuBar />
      </div>
    </main>
  );
}
