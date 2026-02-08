import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/urge', label: 'Urge', icon: '⚡', prominent: true },
  { to: '/analytics', label: 'Analytics', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-app-surface border-t border-app-surfaceHover safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {navItems.map(({ to, label, icon, prominent }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
                prominent
                  ? `-mt-4 px-6 py-3 ${
                      isActive ? 'bg-app-urge text-white' : 'bg-app-surfaceHover text-gray-300 hover:opacity-90'
                    }`
                  : isActive
                    ? 'text-app-accent'
                    : 'text-gray-400 hover:text-gray-300'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
