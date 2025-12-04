import Avatar from '../atoms/Avatar';
import { Icon } from '@iconify/react';

type Props = {
  name?: string;
  username?: string;
  avatarUrl?: string;
  stats?: { post: number; followers: number; following: number; likes: number };
  onEdit?: () => void;
};

export default function ProfileHeader({
  name = 'John Doe',
  username = 'johndoe',
  avatarUrl,
  stats,
  onEdit,
}: Props) {
  return (
    <div className='rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl'>
      <div className='flex items-center justify-between mb-2xl'>
        <button className='text-neutral-25'>←</button>
        <div className='flex items-center gap-md'>
          <span className='text-neutral-25 font-semibold'>{name}</span>
          <Avatar src={avatarUrl} />
        </div>
      </div>
      <div className='flex items-center gap-md'>
        <Avatar size={48} src={avatarUrl} />
        <div className='flex flex-col'>
          <span className='text-neutral-25 font-semibold'>{name}</span>
          <span className='text-neutral-400'>{username}</span>
        </div>
      </div>
      <div className='mt-2xl flex items-center gap-3xl'>
        <button
          onClick={onEdit}
          className='rounded-full border border-neutral-700 text-neutral-25 px-4xl py-sm'
        >
          Edit Profile
        </button>
        <button className='w-10 h-10 rounded-full border border-neutral-700 text-neutral-25 flex items-center justify-center'>
          <Icon icon='lucide:send' />
        </button>
      </div>
      <p className='mt-2xl text-neutral-200'>
        Creating unforgettable moments with my favorite person! Let`s cherish
        every second together!
      </p>
      <div className='mt-2xl grid grid-cols-4 gap-xl text-center text-neutral-25'>
        <div>
          <div className='text-xl font-display'>{stats?.post ?? 0}</div>
          <div className='text-sm text-neutral-400'>Post</div>
        </div>
        <div>
          <div className='text-xl font-display'>{stats?.followers ?? 0}</div>
          <div className='text-sm text-neutral-400'>Followers</div>
        </div>
        <div>
          <div className='text-xl font-display'>{stats?.following ?? 0}</div>
          <div className='text-sm text-neutral-400'>Following</div>
        </div>
        <div>
          <div className='text-xl font-display'>{stats?.likes ?? 0}</div>
          <div className='text-sm text-neutral-400'>Likes</div>
        </div>
      </div>
    </div>
  );
}
