import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LoginPage from '@/features/auth/LoginPage';
import AdminGuard from '@/features/auth/AdminGuard';
import PosPage from '@/features/pos/PosPage';
import OrdersPage from '@/features/orders/OrdersPage';
import DashboardPage from '@/features/admin/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected (requires auth — handled by MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/pos" replace />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/orders" element={<OrdersPage />} />

          {/* Admin only */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <DashboardPage />
              </AdminGuard>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
