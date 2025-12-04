'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { RootState } from '../../store';
import { setMobileAuthOpen } from '../../store/uiSlice';

export default function HeaderSmart() {
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const mobileAuthOpen = useSelector((s: RootState) => s.ui.mobileAuthOpen);
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsMdUp(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const hasToken = !!token;
  const variant = (() => {
    if (isMdUp) return hasToken ? 'after-login' : 'before-login';
    if (hasToken) return 'after-login-mobile';
    return mobileAuthOpen ? 'open-auth-mobile' : 'before-login-mobile';
  })();

  return (
    <Header
      variant={variant}
      onToggleMenuAction={() => dispatch(setMobileAuthOpen(!mobileAuthOpen))}
    />
  );
}
