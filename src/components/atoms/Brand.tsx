import Image from 'next/image';

export default function Brand() {
  return (
    <div className='flex items-center gap-3'>
      <Image
        src='/assets/images/logo-sociality.png'
        alt='Logo Sociality'
        width={30}
        height={30}
      />
      <h1 className='font-display font-bold text-display-xs text-neutral-25'>
        Sociality
      </h1>
    </div>
  );
}
