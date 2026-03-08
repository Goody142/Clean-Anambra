import { useApp } from '@/context/AppContext';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
  info: <Info className="h-4 w-4 text-info" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  emergency: <AlertTriangle className="h-4 w-4 text-emergency" />,
  success: <CheckCircle className="h-4 w-4 text-success" />,
};

const NotificationsPage = () => {
  const { currentUser, notifications, markNotificationRead } = useApp();

  const myNotifications = notifications.filter(n => n.userId === currentUser.id);

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary-foreground" />
          <h1 className="text-primary-foreground text-xl font-bold">Notifications</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {myNotifications.map(n => (
          <button
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`w-full text-left p-4 rounded-xl border transition-colors ${
              n.type === 'emergency'
                ? 'border-emergency/30 bg-emergency/5'
                : !n.read
                ? 'border-primary/20 bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{iconMap[n.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-card-foreground truncate">{n.title}</h3>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </button>
        ))}
        {myNotifications.length === 0 && (
          <p className="text-center text-muted-foreground py-10 text-sm">No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
