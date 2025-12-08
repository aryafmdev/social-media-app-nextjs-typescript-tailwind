import Avatar from '../atoms/Avatar';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

type Props = {
  name?: string;
  username?: string;
  avatarUrl?: string;
  stats?: { post: number; followers: number; following: number; likes: number };
  onEdit?: () => void;
  followState?: { isFollowed: boolean; onToggle: (next: boolean) => void };
};

export default function ProfileHeader({
  name = '',
  username = '',
  avatarUrl,
  stats,
  onEdit,
  followState,
}: Props) {
  const router = useRouter();
  const display = (name ?? username ?? '').trim();
  const uname = (username ?? '').trim();
  return (
    <div className='w-full bg-black'>
      <div className='flex items-center gap-md'>
        <Avatar size={64} src={avatarUrl} />
        <div className='flex flex-col'>
          {display && (
            <span
              className='text-neutral-25 font-semibold'
              suppressHydrationWarning
            >
              {display}
            </span>
          )}
          {uname && (
            <span className='text-neutral-400' suppressHydrationWarning>
              {uname}
            </span>
          )}
        </div>
      </div>
      <div className='mt-2xl flex items-center gap-xl'>
        {onEdit ? (
          <button
            onClick={onEdit}
            className='rounded-full w-full border border-neutral-800 text-sm font-bold text-neutral-25 px-4xl py-md cursor-pointer hover:bg-neutral-800'
          >
            Edit Profile
          </button>
        ) : followState ? (
          followState.isFollowed ? (
            <button
              className='rounded-full w-full border border-neutral-700 text-neutral-25 text-sm font-bold px-4xl py-md flex items-center justify-center gap-sm cursor-pointer'
              onClick={() => followState.onToggle(false)}
              aria-label='unfollow'
            >
              <Icon icon='gg:check-o' className='size-5' />
              <span>Following</span>
            </button>
          ) : (
            <button
              className='rounded-full w-full bg-primary-300 text-neutral-25 px-4xl py-md text-sm font-bold cursor-pointer'
              onClick={() => followState.onToggle(true)}
              aria-label='follow'
            >
              Follow
            </button>
          )
        ) : null}
        <button className='w-12 h-10 text-xl rounded-full border border-neutral-800 text-neutral-25 flex items-center justify-center cursor-pointer'>
          <Icon icon='lucide:send' />
        </button>
      </div>
      <p className='mt-xl text-neutral-200 text-sm font-regular'>
        Creating unforgettable moments with my favorite person!📸✨ Let`s
        cherish every second together!
      </p>
      <div className='mt-xl grid grid-cols-4 gap-xl text-center text-neutral-25'>
        <div>
          <div className='text-xl font-display border-r border-neutral-800'>
            {stats?.post ?? 0}
          </div>
          <div className='text-sm text-neutral-400 border-r border-neutral-800'>
            Post
          </div>
        </div>
        <div
          className='cursor-pointer'
          onClick={() => router.push('/profile/followers')}
          aria-label='go-followers'
        >
          <div className='text-xl font-display border-r border-neutral-800 pr-lg'>
            {stats?.followers ?? 0}
          </div>
          <div className='text-sm text-neutral-400 border-r border-neutral-800 pr-lg'>
            Followers
          </div>
        </div>
        <div
          className='cursor-pointer'
          onClick={() => router.push('/profile/following')}
          aria-label='go-following'
        >
          <div className='text-xl font-display border-r border-neutral-800 pr-lg'>
            {stats?.following ?? 0}
          </div>
          <div className='text-sm text-neutral-400 border-r border-neutral-800 pr-lg'>
            Following
          </div>
        </div>
        <div
          className='cursor-pointer'
          onClick={() => router.push('/profile/likes')}
          aria-label='go-likes'
        >
          <div className='text-xl font-display pr-lg'>{stats?.likes ?? 0}</div>
          <div className='text-sm text-neutral-400 pr-lg'>Likes</div>
        </div>
      </div>
    </div>
  );
}
