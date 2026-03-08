import { useApp } from '@/context/AppContext';
import { UserRole } from '@/data/types';
import { User, Shield, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export const RoleSwitcher = () => {
  const { currentUser, switchRole } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ElementType }[] = [
    { role: 'resident', label: 'Resident', icon: User },
    { role: 'pickup_team', label: 'Pickup Team', icon: Truck },
    { role: 'government', label: 'Government', icon: Shield },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-primary-foreground/10 backdrop-blur rounded-2xl relative z-10">
      {roles.map(({ role, label, icon: Icon }) => (
        <button
          key={role}
          onClick={() => switchRole(role)}
          className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            currentUser.role === role
              ? 'text-primary'
              : 'text-primary-foreground/60 hover:text-primary-foreground/80'
          }`}
        >
          {currentUser.role === role && (
            <motion.div
              layoutId="roleBg"
              className="absolute inset-0 bg-card rounded-xl shadow-md"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Icon className="h-3.5 w-3.5 relative z-10" />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  );
};
