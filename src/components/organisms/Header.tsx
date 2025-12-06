'use client';
import Brand from '../atoms/Brand';
import IconButton from '../atoms/IconButton';
import Avatar from '../atoms/Avatar';
import SearchBar from '../molecules/SearchBar';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../store/authSlice';
import { clearAuthStorage, loadAuth } from '../../lib/authStorage';
import { RootState } from '../../store';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../lib/api/me';

type Variant =
  | 'before-login'
  | 'before-login-mobile'
  | 'open-auth-mobile'
  | 'search-mobile'
  | 'after-login'
  | 'after-login-mobile'
  | 'mobile-profile'
  | 'mobile-edit-profile';

export default function Header({
  variant,
  onToggleSearchAction,
  onToggleAuthAction,
  title,
}: {
  variant?: Variant;
  onToggleSearchAction?: () => void;
  onToggleAuthAction?: () => void;
  title?: string;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((s: RootState) => s.auth.user);
  const savedAuth = typeof window !== 'undefined' ? loadAuth() : undefined;
  const token = useSelector((s: RootState) => s.auth.token);
  const effectiveToken =
    typeof window !== 'undefined' ? (token ?? savedAuth?.token ?? null) : null;
  const me = useQuery({
    queryKey: ['me', 'header'],
    queryFn: () => getMe(effectiveToken as string),
    enabled: !!effectiveToken,
  });
  const displayName =
    [
      user?.name,
      user?.username,
      me.data?.name,
      me.data?.username,
      savedAuth?.user?.name,
      savedAuth?.user?.username,
    ].find((v) => typeof v === 'string' && v.trim().length > 0) ?? '';
  const avatarSrc = me.data?.avatarUrl;

  const base =
    'bg-black sticky top-0 z-50 border-b border-neutral-900 md:px-2xl lg:px-8xl';
  const desktop = 'h-[64px] px-6';
  const mobile = 'h-[64px]';

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    onToggleAuthAction?.();
  };

  if (variant === 'before-login-mobile') {
    return (
      <header
        className={`${base} ${mobile} flex flex-row justify-between items-center px-xl`}
      >
        <Brand />
        <div className='flex items-center gap-md text-3xl'>
          <IconButton onClick={onToggleSearchAction}>
            <Icon icon='lucide:search' />
          </IconButton>
          <IconButton onClick={handleToggleMenu}>
            <Icon icon={isMenuOpen ? 'lucide:menu' : 'lucide:menu'} />
          </IconButton>
        </div>
      </header>
    );
  }

  if (variant === 'open-auth-mobile') {
    return (
      <header
        className={`${base} ${mobile} flex flex-row justify-between items-center px-xl relative`}
      >
        <Brand />
        <div className='flex items-center gap-md text-3xl'>
          <IconButton onClick={onToggleSearchAction}>
            <Icon icon='lucide:search' />
          </IconButton>
          <IconButton onClick={onToggleAuthAction}>
            <Icon icon='lucide:x' />
          </IconButton>
        </div>

        {/* Auth menu dropdown */}
        <div className='absolute top-full left-0 w-full bg-black px-xl py-xl flex gap-xl items-center border-b border-neutral-900'>
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

  if (variant === 'search-mobile') {
    return (
      <header className={`${base} ${mobile} flex flex-row items-center px-xl`}>
        <SearchBar onCloseAction={onToggleSearchAction} />
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
            <Icon icon='lucide:search' className='md:hidden cursor-pointer' />
          </IconButton>
          <Avatar src={avatarSrc} />
          <span
            className='text-neutral-25 font-medium text-md'
            suppressHydrationWarning
          >
            {displayName || 'User'}
          </span>
          <IconButton
            onClick={() => {
              clearAuthStorage();
              dispatch(clearAuth());
              router.push('/login');
            }}
            aria-label='Logout'
          >
            <Icon icon='lucide:log-out' className='text-2xl cursor-pointer' />
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
          <IconButton onClick={onToggleSearchAction}>
            <Icon icon='lucide:search' className='md:hidden cursor-pointer' />
          </IconButton>
          <Avatar src={avatarSrc} />
          <IconButton
            onClick={() => {
              clearAuthStorage();
              dispatch(clearAuth());
              router.push('/login');
            }}
            aria-label='Logout'
          >
            <Icon icon='lucide:log-out' className='text-2xl cursor-pointer' />
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
        <div className='flex items-center gap-md'>
          <IconButton
            className='text-2xl cursor-pointer'
            onClick={() => router.push('/')}
          >
            <Icon icon='lucide:arrow-left' />
          </IconButton>
          <span
            className='text-neutral-25 font-bold text-md'
            suppressHydrationWarning
          >
            {displayName || '-'}
          </span>
        </div>
        <div className='flex items-center gap-md'>
          <Avatar src={avatarSrc} />
          <IconButton
            onClick={() => {
              clearAuthStorage();
              dispatch(clearAuth());
              router.push('/login');
            }}
            aria-label='Logout'
          >
            <Icon icon='lucide:log-out' className='text-2xl cursor-pointer' />
          </IconButton>
        </div>
      </header>
    );
  }

  if (variant === 'mobile-edit-profile') {
    return (
      <header
        className={`${base} ${mobile} flex flex-row justify-between items-center px-xl`}
      >
        <div className='flex items-center gap-md'>
          <IconButton
            className='text-2xl cursor-pointer'
            onClick={() => router.push('/profile')}
          >
            <Icon icon='lucide:arrow-left' />
          </IconButton>
          <span className='text-neutral-25 font-bold text-md'>
            {title ?? 'Edit Profile'}
          </span>
        </div>
        <div className='flex items-center gap-md'>
          <Avatar src={avatarSrc} />
          <IconButton
            onClick={() => {
              clearAuthStorage();
              dispatch(clearAuth());
              router.push('/login');
            }}
            aria-label='Logout'
          >
            <Icon icon='lucide:log-out' className='text-2xl cursor-pointer' />
          </IconButton>
        </div>
      </header>
    );
  }

  return null;
}
