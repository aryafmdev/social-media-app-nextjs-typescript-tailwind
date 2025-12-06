import Avatar from '../atoms/Avatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function PostHeader({
  name,
  username,
  avatarUrl,
  createdAt,
}: {
  name?: string;
  username?: string;
  avatarUrl?: string;
  createdAt?: string;
}) {
  const displayName =
    (name && name.trim()) || (username && username.trim()) || 'Username';
  const timeLabel = (() => {
    if (createdAt && dayjs(createdAt).isValid())
      return dayjs(createdAt).fromNow();
    return 'Just now';
  })();
  return (
    <div className='flex items-center gap-md'>
      <Avatar src={avatarUrl} />
      <div className='flex flex-col'>
        <span className='text-neutral-25 font-semibold'>{displayName}</span>
        <span className='text-neutral-400 text-sm'>{timeLabel}</span>
      </div>
    </div>
  );
}
