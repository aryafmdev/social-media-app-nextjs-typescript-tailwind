import { Icon } from '@iconify/react';

export type ProfileTab = 'gallery' | 'saved';

export default function ProfileTabs({
  active,
  onChange,
}: {
  active: ProfileTab;
  onChange: (t: ProfileTab) => void;
}) {
  return (
    <div className='mt-2xl'>
      <div className='flex justify-around items-center gap-3xl text-neutral-25'>
        <button
          onClick={() => onChange('gallery')}
          className={`flex items-center gap-sm cursor-pointer ${active === 'gallery' ? 'font-bold' : 'text-neutral-400'}`}
        >
          <Icon icon='mingcute:grid-2-fill' className='text-xl' />
          <span>Gallery</span>
        </button>
        <button
          onClick={() => onChange('saved')}
          className={`flex items-center gap-sm cursor-pointer ${active === 'saved' ? 'font-bold' : 'text-neutral-400'}`}
        >
          <Icon
            icon={
              active === 'saved'
                ? 'gravity-ui:bookmark-fill'
                : 'gravity-ui:bookmark'
            }
            className='text-xl'
          />
          <span>Saved</span>
        </button>
      </div>
      <div className='mt-lg h-px bg-neutral-800' />
      <div
        className={`h-1 bg-neutral-25 w-1/2 ${active === 'saved' ? 'ml-[50%]' : 'ml-0'}`}
      />
    </div>
  );
}
