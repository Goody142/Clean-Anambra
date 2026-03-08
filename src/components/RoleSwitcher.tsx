import { useApp } from '@/context/AppContext';
import { UserRole } from '@/data/types';
import { User, Shield, Truck } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentUser, switchRole } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ElementType }[] = [
    { role: 'resident', label: 'Resident', icon: User },
    { role: 'pickup_team', label: 'Pickup Team', icon: Truck },
    { role: 'government', label: 'Government', icon: Shield },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {roles.map(({ role, label, icon: Icon }) => (
        <button
          key={role}
          onClick={() => switchRole(role)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            currentUser.role === role
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
};
