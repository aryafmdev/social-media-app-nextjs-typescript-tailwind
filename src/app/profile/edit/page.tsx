'use client';
import ProfileTemplate from '../../../components/templates/ProfileTemplate';
import dynamic from 'next/dynamic';
const HeaderNoSSR = dynamic(
  () => import('../../../components/organisms/Header'),
  { ssr: false }
);
const ProfileEditFormNoSSR = dynamic(
  () => import('../../../components/molecules/ProfileEditForm'),
  { ssr: false }
);
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../../lib/api/me';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { loadAuth } from '../../../lib/authStorage';

export default function EditProfilePage() {
  const token = useSelector((s: RootState) => s.auth.token);
  const reduxUser = useSelector((s: RootState) => s.auth.user);
  const router = useRouter();
  useEffect(() => {
    const saved = loadAuth();
    if (!token && !saved?.token) router.replace('/login');
  }, [token, router]);
  const saved = typeof window !== 'undefined' ? loadAuth() : undefined;
  const effectiveToken = useMemo(
    () => token ?? saved?.token ?? null,
    [token, saved?.token]
  );
  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(effectiveToken as string),
    enabled: !!effectiveToken,
  });
  const prefill = useMemo(() => {
    if (me.data)
      return { ...me.data } as Partial<import('../../../lib/api/me').Me>;
    if (reduxUser)
      return {
        name: reduxUser.name,
        username: reduxUser.username,
        email: reduxUser.email,
        phone: reduxUser.phone,
        bio: '',
      } as Partial<import('../../../lib/api/me').Me>;
    if (saved?.user)
      return {
        name: saved.user.name,
        username: saved.user.username,
        email: saved.user.email,
        phone: saved.user.phone,
        bio: saved.user.bio,
      } as Partial<import('../../../lib/api/me').Me>;
    return undefined;
  }, [reduxUser, me.data, saved?.user]);
  const meProp = useMemo(() => {
    if (me.data) return me.data as import('../../../lib/api/me').Me;
    if (reduxUser)
      return {
        name: reduxUser.name ?? '',
        username: reduxUser.username ?? '',
        email: reduxUser.email ?? '',
        phone: reduxUser.phone ?? '',
        bio: '',
        avatarUrl: undefined,
        stats: undefined,
      } as import('../../../lib/api/me').Me;
    if (saved?.user)
      return {
        name: saved.user.name ?? '',
        username: saved.user.username ?? '',
        email: saved.user.email ?? '',
        phone: saved.user.phone ?? '',
        bio: '',
        avatarUrl: undefined,
        stats: undefined,
      } as import('../../../lib/api/me').Me;
    return {
      name: '',
      username: '',
      email: '',
      phone: '',
      bio: '',
      avatarUrl: undefined,
      stats: undefined,
    } as import('../../../lib/api/me').Me;
  }, [reduxUser, me.data, saved?.user]);
  return (
    <main className='min-h-screen bg-neutral-950'>
      <HeaderNoSSR variant='mobile-edit-profile' />
      <ProfileTemplate>
        <ProfileEditFormNoSSR
          me={meProp}
          prefill={prefill}
          onDoneAction={() => router.replace('/profile?updated=1')}
        />
      </ProfileTemplate>
    </main>
  );
}
