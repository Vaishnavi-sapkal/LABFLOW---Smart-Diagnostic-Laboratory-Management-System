import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '../types/labflow';

const roleLanding: Record<Role, string> = {
  Admin: '/dashboard',
  Doctor: '/results/verification',
  Receptionist: '/patients/register',
  'Lab Technician': '/results/entry',
  Patient: '/portal',
};

interface AuthContextValue {
  role: Role;
  setRole: (role: Role) => void;
  landingPath: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Admin');
  const value = useMemo(() => ({ role, setRole, landingPath: roleLanding[role] }), [role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export { roleLanding };
