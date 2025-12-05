import Image from 'next/image';
type Props = {
  src?: string;
  alt?: string;
  size?: number;
};

export default function Avatar({ src, alt = 'avatar', size = 40 }: Props) {
  const style = { width: size, height: size } as const;
  const actualSrc = src ?? '/assets/images/avatar.png';
  return (
    <div className='rounded-full overflow-hidden bg-neutral-700' style={style}>
      <Image
        src={actualSrc}
        alt={alt}
        width={size}
        height={size}
        className='w-full h-full object-cover'
      />
    </div>
  );
}
