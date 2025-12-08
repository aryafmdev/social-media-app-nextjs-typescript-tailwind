'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Brand() {
  const router = useRouter();
  return (
    <button
      type='button'
      onClick={() => router.push('/')}
      className='flex items-center gap-3 cursor-pointer bg-transparent'
      aria-label='go-home'
    >
      <Image
        src='/assets/images/logo-sociality.png'
        alt='Logo Sociality'
        width={30}
        height={30}
      />
      <h1 className='font-display font-bold text-display-xs text-neutral-25'>
        Sociality
      </h1>
    </button>
  );
}
