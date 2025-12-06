import Avatar from '../atoms/Avatar';

export default function PostHeader() {
  return (
    <div className='flex items-center gap-md'>
      <Avatar />
      <div className='flex flex-col'>
        <span className='text-neutral-25 font-semibold'>Username</span>
        <span className='text-neutral-400 text-sm'>1 Minutes Ago</span>
      </div>
    </div>
  );
}
