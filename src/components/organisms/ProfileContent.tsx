import { ProfileTab } from '../molecules/ProfileTabs';
import type { MyPost } from '../../lib/api/me';

export default function ProfileContent({
  tab,
  hasPosts,
  onUpload,
  items,
}: {
  tab: ProfileTab;
  hasPosts: boolean;
  onUpload?: () => void;
  items?: MyPost[];
}) {
  if (!hasPosts) {
    return (
      <div className='mt-4xl text-center'>
        <h2 className='font-display text-md font-bold text-neutral-25'>
          Your story starts here
        </h2>
        <p className='text-neutral-300 text-sm font-regular mt-md'>
          Share your first post and let the world see your moments, passions,
          and memories. Make this space truly yours.
        </p>
        <div className='mt-2xl flex justify-center'>
          <button
            onClick={onUpload}
            className='rounded-full bg-primary-300 text-md font-bold text-neutral-25 px-5xl py-md'
          >
            Upload My First Post
          </button>
        </div>
      </div>
    );
  }

  const placeholder: { id: string }[] = Array.from({ length: 9 }).map(
    (_, i) => ({ id: String(i) })
  );
  const list: { id: string }[] =
    items && items.length > 0 ? items.map((p) => ({ id: p.id })) : placeholder;
  const grid = (
    <div className='mt-2xl grid grid-cols-3 gap-md'>
      {list.map((item) => (
        <div key={item.id} className='bg-neutral-800 rounded-xl h-[110px]' />
      ))}
    </div>
  );

  return tab === 'gallery' ? grid : grid;
}
