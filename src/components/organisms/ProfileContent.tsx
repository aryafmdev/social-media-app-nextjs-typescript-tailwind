import { ProfileTab } from '../molecules/ProfileTabs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfileContent(props: {
  tab: ProfileTab;
  hasPosts: boolean;
  items?: { id: string; imageUrl?: string }[];
  onUpload?: () => void;
}) {
  const router = useRouter();
  const { tab, hasPosts, items } = props;

  if (tab === 'gallery' && !hasPosts) {
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
            className='rounded-full bg-primary-300 text-md font-bold text-neutral-25 px-5xl py-md'
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
    return (
      <div className='mt-2xl grid grid-cols-3 gap-xs'>
        {list.map((item) => (
          <div
            key={item.id}
            className='rounded-xs overflow-hidden h-[110px] relative'
          >
            <Image
              src={item.imageUrl}
              alt={`${tab} image`}
              fill
              sizes='(min-width: 768px) 33vw, 100vw'
              className='object-cover'
              unoptimized
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='mt-2xl grid grid-cols-3 gap-xs'>
      {list.map((item) => (
        <div
          key={item.id}
          className='rounded-xs overflow-hidden h-[110px] relative'
        >
          <Image
            src={item.imageUrl}
            alt={`${tab} image`}
            fill
            sizes='(min-width: 768px) 33vw, 100vw'
            className='object-cover'
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
