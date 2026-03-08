import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Truck, BarChart3, Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/pickup', icon: Truck, label: 'Pickup' },
  { path: '/dashboard', icon: BarChart3, label: 'Monitor' },
  { path: '/notifications', icon: Bell, label: 'Alerts' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          const showBadge = path === '/notifications' && unreadCount > 0;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors relative ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
              {showBadge && (
                <span className="absolute -top-0.5 right-1 h-4 w-4 rounded-full bg-emergency text-emergency-foreground text-[10px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
