'use client';
import Avatar from '../atoms/Avatar';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

export default function EditProfileHeader({
  name = 'Edit Profile',
  avatarUrl,
}: {
  name?: string;
  avatarUrl?: string;
}) {
  const router = useRouter();
  return (
    <div className='w-full flex items-center justify-between px-[16px] py-[12px] border-b border-neutral-800'>
      <button
        className='flex items-center gap-sm text-neutral-25'
        onClick={() => router.push('/profile')}
      >
        <Icon icon='lucide:arrow-left' />
        <span className='font-semibold'>{name}</span>
      </button>
      <Avatar src={avatarUrl} />
    </div>
  );
}
