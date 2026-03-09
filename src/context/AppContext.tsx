import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, WasteReport, PickupTask, Notification, ReportCategory, ReportPriority, ReportStatus, UserRole } from '@/data/types';
import { initialUsers, initialReports, initialTasks, initialNotifications } from '@/data/mockData';
import { triggerEmergencyAlert, triggerNotificationAlert, triggerSuccessAlert } from '@/lib/notifications';
interface AppState {
  currentUser: User;
  users: User[];
  reports: WasteReport[];
  tasks: PickupTask[];
  notifications: Notification[];
  switchRole: (role: UserRole) => void;
  addReport: (report: Omit<WasteReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  acceptTask: (reportId: string) => void;
  updateTaskStatus: (taskId: string, status: ReportStatus, afterImageUrl?: string) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [reports, setReports] = useState<WasteReport[]>(initialReports);
  const [tasks, setTasks] = useState<PickupTask[]>(initialTasks);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const switchRole = useCallback((role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) setCurrentUser(user);
  }, [users]);

  const addReport = useCallback((data: Omit<WasteReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = new Date().toISOString();
    const newReport: WasteReport = {
      ...data,
      id: `r${Date.now()}`,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    setReports(prev => [newReport, ...prev]);

    // Notify government
    const govUser = users.find(u => u.role === 'government');
    if (govUser) {
      const isEmergency = data.priority === 'emergency';
      setNotifications(prev => [{
        id: `n${Date.now()}`,
        userId: govUser.id,
        title: isEmergency ? '🚨 Emergency Alert' : 'New Report Submitted',
        message: `${isEmergency ? 'EMERGENCY: ' : ''}New ${data.category.replace(/_/g, ' ')} report at ${data.location.address}`,
        type: isEmergency ? 'emergency' : 'info',
        read: false,
        createdAt: now,
        reportId: newReport.id,
      }, ...prev]);

      // Trigger sound and vibration for emergency alerts
      if (isEmergency) {
        triggerEmergencyAlert();
      } else {
        triggerNotificationAlert();
      }
    }
  }, [users]);

  const acceptTask = useCallback((reportId: string) => {
    const now = new Date().toISOString();
    const newTask: PickupTask = {
      id: `t${Date.now()}`,
      reportId,
      teamId: currentUser.id,
      status: 'assigned',
      acceptedAt: now,
    };
    setTasks(prev => [...prev, newTask]);
    setReports(prev => prev.map(r =>
      r.id === reportId ? { ...r, status: 'assigned', assignedTeamId: currentUser.id, updatedAt: now } : r
    ));

    const report = reports.find(r => r.id === reportId);
    if (report) {
      setNotifications(prev => [{
        id: `n${Date.now()}`,
        userId: report.reporterId,
        title: 'Report Update',
        message: `Your report at ${report.location.address} has been assigned to a cleanup team.`,
        type: 'info',
        read: false,
        createdAt: now,
        reportId,
      }, ...prev]);
      // Notify reporter with sound
      triggerNotificationAlert();
    }
  }, [currentUser, reports]);

  const updateTaskStatus = useCallback((taskId: string, status: ReportStatus, afterImageUrl?: string) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status, completedAt: status === 'completed' ? now : undefined, afterImageUrl: afterImageUrl || t.afterImageUrl } : t
    ));

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setReports(prev => prev.map(r =>
        r.id === task.reportId ? { ...r, status, updatedAt: now } : r
      ));
      if (status === 'completed') {
        const report = reports.find(r => r.id === task.reportId);
        if (report) {
          setNotifications(prev => [{
            id: `n${Date.now()}`,
            userId: report.reporterId,
            title: '✅ Cleanup Completed',
            message: `The sanitation issue at ${report.location.address} has been resolved.`,
            type: 'success',
            read: false,
            createdAt: now,
            reportId: task.reportId,
          }, ...prev]);
          // Play success sound for completed tasks
          triggerSuccessAlert();
        }
      }
    }
  }, [tasks, reports]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser, users, reports, tasks, notifications,
      switchRole, addReport, acceptTask, updateTaskStatus, markNotificationRead, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};
