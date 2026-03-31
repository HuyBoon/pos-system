import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  ClipboardList,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { clearCart } from '@/store/slices/cartSlice';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/pos', label: 'POS', icon: ShoppingCart },
  { to: '/orders', label: 'Đơn hàng', icon: ClipboardList, badgeKey: 'pendingOrders' as const },
];

const adminItems = [
  { to: '/admin', label: 'Quản lý', icon: LayoutDashboard },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);
  const pendingCount = useAppSelector(
    (state) => state.orders.orders.filter((o) => o.status === 'PENDING').length
  );
  const isAdmin = currentUser?.role === 'ADMIN';

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-[220px] h-full bg-surface-raised border-r border-border flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/15 text-primary-light border border-primary/20'
                  : 'text-text-muted hover:text-text hover:bg-surface-overlay border border-transparent'
              )
            }
          >
            <item.icon size={18} />
            <span className="flex-1">{item.label}</span>
            {item.badgeKey === 'pendingOrders' && pendingCount > 0 && (
              <Badge variant="warning" size="sm">{pendingCount}</Badge>
            )}
          </NavLink>
        ))}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                Admin
              </p>
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/15 text-primary-light border border-primary/20'
                      : 'text-text-muted hover:text-text hover:bg-surface-overlay border border-transparent'
                  )
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full
                     text-text-muted hover:text-danger hover:bg-danger/10
                     transition-all duration-200 cursor-pointer"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
