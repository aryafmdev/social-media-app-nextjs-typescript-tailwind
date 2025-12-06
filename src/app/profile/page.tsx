'use client';
import { useEffect, useMemo, useState } from 'react';
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
import { getMySaved } from '../../lib/api/saves';
import { loadAuth } from '../../lib/authStorage';
import AlertBanner from '../../components/organisms/AlertBanner';

export default function ProfilePage() {
  const token = useSelector((s: RootState) => s.auth.token);
  const reduxUser = useSelector((s: RootState) => s.auth.user);
  const router = useRouter();
  const [tab, setTab] = useState<ProfileTab>('gallery');
  const [hasPostsOverride, setHasPostsOverride] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const saved = loadAuth();
    if (!token && !saved?.token) router.replace('/login');
  }, [token, router]);

  const [isMdUp, setIsMdUp] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsMdUp(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const savedAuth = typeof window !== 'undefined' ? loadAuth() : undefined;
  const effectiveToken = useMemo(
    () => token ?? savedAuth?.token ?? null,
    [token, savedAuth?.token]
  );

  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(effectiveToken as string),
    enabled: !!effectiveToken,
  });
  const posts = useQuery({
    queryKey: ['me', 'posts', 1, 20],
    queryFn: () => getMyPosts(effectiveToken as string, 1, 20),
    enabled: !!effectiveToken,
  });
  const saved = useQuery({
    queryKey: ['me', 'saved', 1, 20],
    queryFn: () => getMySaved(effectiveToken as string, 1, 20),
    enabled: !!effectiveToken,
  });
  const hasPosts = (hasPostsOverride ??
    (me.data?.stats?.post ?? 0) > 0) as boolean;

  return (
    <main className='min-h-screen bg-neutral-950'>
      <Header variant={isMdUp ? 'after-login' : 'mobile-profile'} />
      <ProfileTemplate>
        <ProfileHeader
          name={[reduxUser?.name, me.data?.name, savedAuth?.user?.name].find(
            (v) => typeof v === 'string' && v.trim().length > 0
          )}
          username={[
            reduxUser?.username,
            me.data?.username,
            savedAuth?.user?.username,
          ].find((v) => typeof v === 'string' && v.trim().length > 0)}
          avatarUrl={me.data?.avatarUrl}
          stats={me.data?.stats}
          onEdit={() => router.push('/profile/edit')}
        />
        {typeof window !== 'undefined' &&
          new URLSearchParams(window.location.search).get('updated') ===
            '1' && (
            <AlertBanner variant='success' label='Profile Success Update' />
          )}
        <ProfileTabs active={tab} onChange={setTab} />
        <ProfileContent
          tab={tab}
          hasPosts={hasPosts}
          onUpload={() => setHasPostsOverride(true)}
          items={tab === 'saved' ? saved.data?.items : posts.data?.items}
        />
      </ProfileTemplate>
      <div className='fixed inset-x-0 bottom-10 flex justify-center'>
        <MenuBar />
      </div>
    </main>
  );
}
