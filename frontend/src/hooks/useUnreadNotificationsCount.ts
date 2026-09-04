import { useEffect, useState } from 'react';
import { useAuth } from '../app/AuthContext';
import { listNotifications } from '../api/notifications';

const roleByAppRole = {
  Admin: 'admin',
  Doctor: 'doctor',
  Receptionist: 'receptionist',
  'Lab Technician': 'lab_technician',
  Patient: 'patient',
} as const;

export function useUnreadNotificationsCount(): number {
  const { role, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadUnreadCount = async () => {
      try {
        const response = await listNotifications({ role: roleByAppRole[role], userId: user?.id });
        if (active) setUnreadCount(response.summary.unreadCount);
      } catch {
        // Badge counts should not surface fetch errors in the application shell.
      }
    };

    void loadUnreadCount();
    return () => { active = false; };
  }, [role, user?.id]);

  return unreadCount;
}
