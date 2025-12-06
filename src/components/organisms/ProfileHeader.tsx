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
  name = '',
  username = '',
  avatarUrl,
  stats,
  onEdit,
}: Props) {
  return (
    <div className='w-full bg-black'>
    
      <div className='flex items-center gap-md'>
        <Avatar size={64} src={avatarUrl} />
        <div className='flex flex-col'>
          <span className='text-neutral-25 font-semibold'>{name}</span>
          <span className='text-neutral-400'>{username}</span>
        </div>
      </div>
      <div className='mt-2xl flex items-center gap-xl'>
        <button
          onClick={onEdit}
          className='rounded-full w-full border border-neutral-800 text-sm font-bold text-neutral-25 px-4xl py-md cursor-pointer hover:bg-neutral-800'
        >
          Edit Profile
        </button>
        <button className='w-12 h-10 text-xl rounded-full border border-neutral-800 text-neutral-25 flex items-center justify-center cursor-pointer'>
          <Icon icon='lucide:send' />
        </button>
      </div>
      <p className='mt-xl text-neutral-200 text-sm font-regular'>
        Creating unforgettable moments with my favorite person!📸✨ Let`s cherish
        every second together!
      </p>
      <div className='mt-xl grid grid-cols-4 gap-xl text-center text-neutral-25'>
        <div>
          <div className='text-xl font-display border-r border-neutral-800'>{stats?.post ?? 0}</div>
          <div className='text-sm text-neutral-400 border-r border-neutral-800'>Post</div>
        </div>
        <div>
          <div className='text-xl font-display border-r border-neutral-800 pr-lg'>{stats?.followers ?? 0}</div>
          <div className='text-sm text-neutral-400 border-r border-neutral-800 pr-lg'>Followers</div>
        </div>
        <div>
          <div className='text-xl font-display border-r border-neutral-800 pr-lg'>{stats?.following ?? 0}</div>
          <div className='text-sm text-neutral-400 border-r border-neutral-800 pr-lg'>Following</div>
        </div>
        <div>
          <div className='text-xl font-display pr-lg'>{stats?.likes ?? 0}</div>
          <div className='text-sm text-neutral-400 pr-lg'>Likes</div>
        </div>
      </div>
    </div>
  );
}
