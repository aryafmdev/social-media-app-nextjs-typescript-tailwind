'use client';
import Brand from '../atoms/Brand';
import IconButton from '../atoms/IconButton';
import Avatar from '../atoms/Avatar';
import SearchBar from '../molecules/SearchBar';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../store/authSlice';
import { clearAuthStorage } from '../../lib/authStorage';
import { useState } from 'react';

type Variant =
  | 'before-login'
  | 'before-login-mobile'
  | 'open-auth-mobile'
  | 'search'
  | 'after-login'
  | 'after-login-mobile'
  | 'mobile-profile';

export default function Header({
  variant,
  onToggleMenuAction,
}: {
  variant?: Variant;
  onToggleMenuAction?: () => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [variantState, setVariantState] = useState<Variant>(variant);

  const base = 'bg-black sticky top-0 z-50 border-b border-neutral-900';
  const desktop = 'h-[64px] px-6';
  const mobile = 'h-[64px]';

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    onToggleMenuAction?.();
  };

  // const handleSearchToggle = () => {
  //   setVariantState('search');
  // };

  // const handleSearchClose = () => {
  //   setVariantState(variant);
  // };

  if (variant === 'open-auth-mobile') {
    return (
      <header
        className={`${base} w-full h-[120px] flex flex-col items-start p-0`}
      >
        <div className='w-full flex flex-row justify-between items-center px-xl mt-md'>
          <Brand />
          <div className='flex items-center gap-md text-3xl'>
            <IconButton>
              <Icon icon='lucide:search' />
            </IconButton>
            <IconButton onClick={handleToggleMenu}>
              <Icon icon={isMenuOpen ? 'lucide:x' : 'lucide:menu'} />
            </IconButton>
          </div>
        </div>
        <div className='w-full px-xl mt-md flex gap-xl items-center'>
          <a
            href='/login'
            className='flex-1 rounded-full border border-neutral-700 text-neutral-25 px-3xl py-sm text-center'
          >
            Login
          </a>
          <a
            href='/register'
            className='flex-1 rounded-full bg-primary-200 text-neutral-25 px-3xl py-sm text-center'
          >
            Register
          </a>
        </div>
      </header>
    );
  }

  if (variant === 'search') {
    return (
      <header className={`${base} ${mobile} flex flex-row items-center px-xl`}>
        <SearchBar onCloseAction={onToggleMenuAction} />
      </header>
    );
  }

  if (variant === 'before-login') {
    return (
      <header
        className={`${base} ${desktop} flex flex-row justify-between items-center px-xl`}
      >
        <Brand />
        <div className='flex-1 flex justify-center'>
          <div className=''>
            <SearchBar onCloseAction={onToggleMenuAction} />
          </div>
        </div>
        <div className='flex items-center gap-xl'>
          <a
            href='/login'
            className='rounded-full lg:w-[130px] text-center border border-neutral-700 text-neutral-25 px-3xl py-md'
          >
            Login
          </a>
          <a
            href='/register'
            className='rounded-full lg:w-[130px] text-center bg-primary-200 text-neutral-25 px-3xl py-md'
          >
            Register
          </a>
        </div>
      </header>
    );
  }

  if (variant === 'before-login-mobile') {
    return (
      <header
        className={`${base} ${mobile} flex flex-row justify-between items-center px-xl`}
      >
        <Brand />
        <div className='flex items-center gap-md text-3xl'>
          <IconButton>
            <Icon icon='lucide:search' />
          </IconButton>
          <IconButton onClick={handleToggleMenu}>
            <Icon icon={isMenuOpen ? 'lucide:x' : 'lucide:menu'} />
          </IconButton>
        </div>
      </header>
    );
  }

  if (variant === 'after-login') {
    return (
      <header
        className={`${base} ${desktop} flex flex-row justify-between items-center px-xl`}
      >
        <Brand />
        <div className='flex-1 flex justify-center'>
          <div className=''>
            <SearchBar />
          </div>
        </div>
        <div className='flex items-center gap-md text-3xl'>
          <IconButton>
            <Icon icon='lucide:search' className='md:hidden' />
          </IconButton>
          <Avatar />
          <span className='text-neutral-25 font-medium text-md'>John Doe</span>
          <IconButton
            onClick={() => {
              clearAuthStorage();
              dispatch(clearAuth());
              router.push('/login');
            }}
            aria-label='Logout'
          >
            <Icon icon='lucide:log-out' />
          </IconButton>
        </div>
      </header>
    );
  }

  if (variant === 'after-login-mobile') {
    return (
      <header
        className={`${base} ${mobile} flex flex-row justify-between items-center px-xl`}
      >
        <Brand />
        <div className='flex items-center gap-md text-3xl'>
          <IconButton onClick={onToggleMenuAction}>
            <Icon icon='lucide:search' />
          </IconButton>
          <Avatar />
          <IconButton
            onClick={() => {
              clearAuthStorage();
              dispatch(clearAuth());
              router.push('/login');
            }}
            aria-label='Logout'
          >
            <Icon icon='lucide:log-out' />
          </IconButton>
        </div>
      </header>
    );
  }

  if (variant === 'mobile-profile') {
    return (
      <header
        className={`${base} ${mobile} flex flex-row justify-between items-center px-xl`}
      >
        <button className='text-neutral-25'>←</button>
        <div className='flex items-center gap-md'>
          <span className='text-neutral-25'>John Doe</span>
          <Avatar />
          <IconButton
            onClick={() => {
              clearAuthStorage();
              dispatch(clearAuth());
              router.push('/login');
            }}
            aria-label='Logout'
          >
            <Icon icon='lucide:log-out' />
          </IconButton>
        </div>
      </header>
    );
  }

  return null;
}
