'use client';
import ProfileTemplate from '../../../components/templates/ProfileTemplate';
import Header from '../../../components/organisms/Header';
import ProfileEditForm from '../../../components/molecules/ProfileEditForm';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../../lib/api/me';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { loadAuth } from '../../../lib/authStorage';

export default function EditProfilePage() {
  const token = useSelector((s: RootState) => s.auth.token);
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
    if (saved?.user)
      return {
        name: saved.user.name,
        username: saved.user.username,
        email: saved.user.email,
        phone: saved.user.phone,
      } as Partial<import('../../../lib/api/me').Me>;
    return undefined;
  }, [me.data, saved?.user]);
  return (
    <main className='min-h-screen bg-neutral-950'>
      <Header variant='mobile-edit-profile' />
      <ProfileTemplate>
        <ProfileEditForm
          me={{
            name: '',
            username: '',
            email: '',
            phone: '',
            bio: '',
            avatarUrl: undefined,
          }}
          prefill={prefill}
          onDoneAction={() => router.replace('/profile?updated=1')}
        />
      </ProfileTemplate>
    </main>
  );
}
