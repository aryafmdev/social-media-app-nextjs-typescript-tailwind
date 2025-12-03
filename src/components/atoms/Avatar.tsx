type Props = {
  src?: string;
  alt?: string;
  size?: number;
};

export default function Avatar({ src, alt = 'avatar', size = 32 }: Props) {
  const style = { width: size, height: size } as const;
  return (
    <div className='rounded-full overflow-hidden bg-neutral-700' style={style}>
      {src ? (
        <img src={src} alt={alt} className='w-full h-full object-cover' />
      ) : (
        <div className='w-full h-full flex items-center justify-center text-neutral-200'>
          JD
        </div>
      )}
    </div>
  );
}
