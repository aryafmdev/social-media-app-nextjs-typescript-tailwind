import { ProfileTab } from '../molecules/ProfileTabs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfileContent(props: {
  tab: ProfileTab;
  hasPosts: boolean;
  items?: { id: string; imageUrl?: string }[];
  onUpload?: () => void;
  publicView?: boolean;
}) {
  const router = useRouter();
  const { tab, hasPosts, items, publicView } = props;

  if (tab === 'gallery' && !hasPosts && !publicView) {
    return (
      <div className='mt-2xl text-center'>
        <h2 className='font-display text-md font-bold text-neutral-25'>
          Your story starts here
        </h2>
        <p className='text-neutral-300 text-sm font-regular mt-md'>
          Share your first post and let the world see your moments, passions,
          and memories. Make this space truly yours.
        </p>
        <div className='mt-2xl flex justify-center'>
          <button
            onClick={() => router.push('/posts/new')}
            className='rounded-full bg-primary-300 text-md font-bold text-neutral-25 px-5xl py-md cursor-pointer'
          >
            Upload My First Post
          </button>
        </div>
      </div>
    );
  }

  const list = (items ?? [])
    .filter(
      (p) => typeof p.imageUrl === 'string' && p.imageUrl!.trim().length > 0
    )
    .map((p) => ({ id: p.id, imageUrl: p.imageUrl as string }));

  if (tab !== 'gallery') {
    if (tab === 'saved' && list.length === 0) {
      return (
        <div className='mt-2xl text-center'>
          <div className='text-neutral-25 font-bold text-md'>
            No liked posts yet
          </div>
          <div className='text-neutral-400 text-sm'>
            Explore and like posts to see them here
          </div>
        </div>
      );
    }
    return (
      <div className='mt-2xl grid grid-cols-3 gap-xs'>
        {list.map((item) => (
          <button
            key={item.id}
            type='button'
            className='rounded-xs overflow-hidden cursor-pointer'
            onClick={() => router.push(`/posts/${item.id}`)}
            aria-label={`open-${tab}-${item.id}`}
          >
            <Image
              src={item.imageUrl}
              alt={`${tab} image`}
              width={600}
              height={600}
              sizes='(min-width: 768px) 33vw, 100vw'
              className='w-full h-auto'
              unoptimized
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className='mt-2xl grid grid-cols-3 gap-xs'>
      {list.map((item) => (
        <button
          key={item.id}
          type='button'
          className='rounded-xs overflow-hidden cursor-pointer'
          onClick={() => router.push(`/posts/${item.id}`)}
          aria-label={`open-${tab}-${item.id}`}
        >
          <Image
            src={item.imageUrl}
            alt={`${tab} image`}
            width={600}
            height={600}
            sizes='(min-width: 768px) 33vw, 100vw'
            className='w-full h-auto'
            unoptimized
          />
        </button>
      ))}
    </div>
  );
}
