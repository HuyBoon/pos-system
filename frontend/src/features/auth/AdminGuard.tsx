import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { currentUser } = useAppSelector((state) => state.auth);

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <Navigate to="/pos" replace />;
  }

  return <>{children}</>;
}
