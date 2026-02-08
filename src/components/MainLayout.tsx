import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Toast } from './Toast';
import { useReminder } from '../hooks/useReminder';

const NAV_PATHS = ['/', '/urge', '/analytics', '/settings'];

export function MainLayout() {
  const location = useLocation();
  useReminder();
  const showNav = NAV_PATHS.includes(location.pathname);

  return (
    <>
      <main className={showNav ? 'pb-20' : ''}>
        <Outlet />
      </main>
      {showNav && <BottomNav />}
      <Toast />
    </>
  );
}
