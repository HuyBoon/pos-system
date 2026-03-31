import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Card, Badge, Table } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';
import { products, categories, staff } from '@/data/mockData';
import { formatVND } from '@/lib/utils';
import type { Product } from '@/types';

export default function DashboardPage() {
  const { orders } = useAppSelector((state) => state.orders);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalStaff = staff.length;

  // ─── Stats cards ───
  const stats = [
    {
      label: 'Doanh thu',
      value: formatVND(totalRevenue),
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success/15',
    },
    {
      label: 'Đơn hàng',
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-primary-light',
      bg: 'bg-primary/15',
    },
    {
      label: 'Sản phẩm',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-warning',
      bg: 'bg-warning/15',
    },
    {
      label: 'Nhân viên',
      value: totalStaff.toString(),
      icon: Users,
      color: 'text-accent',
      bg: 'bg-accent/15',
    },
  ];

  // ─── Product table columns ───
  const productColumns: TableColumn<Product>[] = [
    {
      key: 'image',
      header: '',
      render: (p) => <span className="text-xl">{p.image || '📦'}</span>,
      width: '50px',
    },
    {
      key: 'name',
      header: 'Tên sản phẩm',
      render: (p) => <span className="font-medium">{p.name}</span>,
    },
    {
      key: 'category',
      header: 'Danh mục',
      render: (p) => {
        const cat = categories.find((c) => c.id === p.categoryId);
        return <span className="text-text-muted">{cat?.icon} {cat?.name}</span>;
      },
    },
    {
      key: 'price',
      header: 'Giá',
      render: (p) => <span className="text-text-muted">{formatVND(p.price)}</span>,
      width: '130px',
    },
    {
      key: 'stock',
      header: 'Tồn kho',
      render: (p) => (
        <Badge
          variant={p.stock > 20 ? 'success' : p.stock > 5 ? 'warning' : 'danger'}
          dot
          size="sm"
        >
          {p.stock}
        </Badge>
      ),
      width: '100px',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <TrendingUp size={22} className="text-primary-light" />
          Bảng điều khiển
        </h1>
        <p className="text-sm text-text-muted mt-1">Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
            <Card.Body>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Products table */}
      <Card>
        <Card.Header>
          <h2 className="text-base font-semibold">Danh sách sản phẩm</h2>
        </Card.Header>
        <Card.Body className="p-0">
          <Table<Product>
            columns={productColumns}
            data={products}
            keyExtractor={(p) => p.id}
            className="border-0 rounded-none"
          />
        </Card.Body>
      </Card>

      {/* Staff overview */}
      <Card>
        <Card.Header>
          <h2 className="text-base font-semibold">Nhân viên</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staff.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 bg-surface-overlay/50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-light">
                    {s.displayName?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{s.displayName}</p>
                  <Badge
                    variant={s.role === 'ADMIN' ? 'info' : 'default'}
                    size="sm"
                  >
                    {s.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
