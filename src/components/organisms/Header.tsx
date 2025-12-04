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

type Variant =
  | 'before-login'
  | 'before-login-mobile'
  | 'open-auth-mobile'
  | 'search'
  | 'after-login'
  | 'after-login-mobile'
  | 'mobile-profile';

export default function Header({
  variant = 'before-login',
  onToggleMenuAction,
}: {
  variant?: Variant;
  onToggleMenuAction?: () => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const base = 'bg-black sticky top-0 z-50';
  const desktop = 'h-[80px] px-6';
  const mobile = 'h-[64px]';

  if (variant === 'open-auth-mobile') {
    return (
      <header
        className={`${base} w-full h-[120px] flex flex-col items-start p-0`}
      >
        <div className='w-full flex flex-row justify-between items-center px-[16px]'>
          <Brand />
          <div className='flex items-center gap-md'>
            <IconButton>
              <Icon icon='lucide:search' />
            </IconButton>
            <IconButton onClick={onToggleMenuAction}>
              <Icon icon='lucide:menu' />
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
        <SearchBar />
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
            <SearchBar />
          </div>
        </div>
        <div className='flex items-center gap-xl'>
          <a
            href='/login'
            className='rounded-full border border-neutral-700 text-neutral-25 px-3xl py-sm'
          >
            Login
          </a>
          <a
            href='/register'
            className='rounded-full bg-primary-200 text-neutral-25 px-3xl py-sm'
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
        <div className='flex items-center gap-md'>
          <IconButton>
            <Icon icon='lucide:search' />
          </IconButton>
          <IconButton onClick={onToggleMenuAction}>
            <Icon icon='lucide:menu' />
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
        <div className='flex items-center gap-md'>
          <IconButton>
            <Icon icon='lucide:search' />
          </IconButton>
          <Avatar />
          <span className='text-neutral-25 font-medium'>John Doe</span>
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
        <div className='flex items-center gap-md'>
          <IconButton>
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
