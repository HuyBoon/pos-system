import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
