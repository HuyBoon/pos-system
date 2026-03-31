import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { freeTable } from '@/store/slices/tableSlice';
import { formatVND, formatDateTime } from '@/lib/utils';
import type { Order } from '@/types';
import { ordersApi } from '@/services/orders.api';

type FilterTab = 'all' | 'PENDING' | 'COMPLETED' | 'CANCELLED';

const filterTabs: { key: FilterTab; label: string; icon: typeof Clock }[] = [
  { key: 'all', label: 'Tất cả', icon: ClipboardList },
  { key: 'PENDING', label: 'Đang phục vụ', icon: Clock },
  { key: 'COMPLETED', label: 'Hoàn thành', icon: CheckCircle },
  { key: 'CANCELLED', label: 'Đã hủy', icon: XCircle },
];

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { tables } = useAppSelector((state) => state.tables);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const filteredOrders =
    activeFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED');

  const handleCompleteOrder = (order: Order) => {
    updateStatusMutation.mutate({ id: order.id, status: 'COMPLETED' });
    if (order.tableId) {
      dispatch(freeTable(order.tableId));
    }
  };

  const handleCancelOrder = (order: Order) => {
    updateStatusMutation.mutate({ id: order.id, status: 'CANCELLED' });
    if (order.tableId) {
      dispatch(freeTable(order.tableId));
    }
  };

  const statusBadge = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning" dot size="sm">Đang phục vụ</Badge>;
      case 'COMPLETED':
        return <Badge variant="success" dot size="sm">Hoàn thành</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger" dot size="sm">Đã hủy</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <ClipboardList size={22} className="text-primary-light" />
          Quản lý đơn hàng
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Theo dõi đơn hàng và trạng thái bàn
        </p>
      </div>

      {/* ── Live Tables Overview ── */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Users size={16} className="text-primary-light" />
              Bàn đang phục vụ
            </h2>
            <Badge variant="info" size="sm">{occupiedTables.length} bàn</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {occupiedTables.length === 0 ? (
            <div className="text-center py-6 text-text-muted">
              <Users size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Không có bàn nào đang phục vụ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {occupiedTables.map((table) => {
                const order = orders.find((o) => o.id === table.currentOrderId);
                return (
                  <div
                    key={table.id}
                    className="flex items-start gap-3 p-3 bg-danger/5 border border-danger/20 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                      <span className="text-lg">🪑</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-text">{table.name}</p>
                        <Badge variant="danger" dot size="sm">Có khách</Badge>
                      </div>
                      {order && (
                        <div className="mt-1.5 space-y-0.5">
                          <p className="text-xs text-text-muted">
                            <span className="font-medium text-text">#{order.id}</span> •{' '}
                            {order.customerName || 'Khách lẻ'}
                          </p>
                          <p className="text-xs text-text-muted">
                            {order?.items?.length || 0} món •{' '}
                            <span className="font-semibold text-primary-light">
                              {formatVND(order?.totalAmount || 0)}
                            </span>
                          </p>
                          <div className="flex gap-1.5 mt-2">
                            <Button
                              size="sm"
                              onClick={() => handleCompleteOrder(order)}
                              icon={<CheckCircle size={12} />}
                            >
                              Thanh toán
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancelOrder(order)}
                              icon={<XCircle size={12} />}
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <Card.Body>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Đang phục vụ
                </p>
                <p className="text-2xl font-bold text-warning mt-1">{pendingOrders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
                <Clock size={20} className="text-warning" />
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Tổng đơn hàng
                </p>
                <p className="text-2xl font-bold text-text mt-1">{orders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <ClipboardList size={20} className="text-primary-light" />
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Doanh thu
                </p>
                <p className="text-2xl font-bold text-success mt-1">
                  {formatVND(
                    orders
                      .filter((o) => o?.status === 'COMPLETED')
                      .reduce((sum, o) => sum + (o?.totalAmount || 0), 0)
                  )}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
                <DollarSign size={20} className="text-success" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* ── Order History ── */}
      <Card>
        <Card.Header>
          <h2 className="text-base font-semibold">Lịch sử đơn hàng</h2>
        </Card.Header>
        <Card.Body className="p-0">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 px-4 pt-3 pb-2 border-b border-border overflow-x-auto">
            {filterTabs.map((tab) => {
              const count =
                tab.key === 'all'
                  ? orders.length
                  : orders.filter((o) => o.status === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    transition-all cursor-pointer whitespace-nowrap
                    ${activeFilter === tab.key
                      ? 'bg-primary/15 text-primary-light'
                      : 'text-text-muted hover:text-text hover:bg-surface-overlay'
                    }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                  <span className="bg-surface-overlay/80 px-1.5 py-0.5 rounded text-[10px]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Order list */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredOrders.map((order) => (
                <div key={order.id} className="hover:bg-surface-overlay/20 transition-colors">
                  {/* Order summary row */}
                  <button
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order.id ? null : order.id
                      )
                    }
                    className="w-full px-4 py-3 flex items-center gap-4 text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-overlay flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-text-muted">
                        #{order.id}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text">
                          {order.customerName || 'Khách lẻ'}
                        </p>
                        {statusBadge(order.status)}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {order.tableName || (order.tableId ? `Bàn ${order.tableId}` : 'Mang đi')} • {formatDateTime(order.createdAt)} •{' '}
                        {order.staffName || (order as any).staff?.username || 'Nhân viên'}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-light">
                      {formatVND(order.totalAmount)}
                    </span>
                    {expandedOrderId === order.id ? (
                      <ChevronUp size={16} className="text-text-muted" />
                    ) : (
                      <ChevronDown size={16} className="text-text-muted" />
                    )}
                  </button>

                  {/* Expanded details */}
                  {expandedOrderId === order.id && (
                    <div className="px-4 pb-3 pl-18 animate-fade-in">
                      <div className="bg-surface-overlay/50 rounded-xl p-3 space-y-1.5">
                        {order?.items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-text-muted">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="text-text">
                              {formatVND((item.price || 0) * (item.quantity || 0))}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm font-semibold">
                          <span>Tổng</span>
                          <span className="text-primary-light">
                            {formatVND(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Actions for pending orders */}
                      {order.status === 'PENDING' && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            icon={<CheckCircle size={14} />}
                            onClick={() => handleCompleteOrder(order)}
                          >
                            Thanh toán & Giải phóng bàn
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={<XCircle size={14} />}
                            onClick={() => handleCancelOrder(order)}
                          >
                            Hủy đơn
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
