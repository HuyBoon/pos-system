import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Modal } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import { formatVND } from '@/lib/utils';
import type { Order } from '@/types';
import { ordersApi } from '@/services/orders.api';
import { tablesApi } from '@/services/tables.api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
  preSelectedTableId: number | null; // from PosPage table selection
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onOrderCreated,
  preSelectedTableId,
}: CheckoutModalProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { currentUser } = useAppSelector((state) => state.auth);

  // Fetch tables from DB instead of Redux
  const { data: tables = [] } = useQuery({
    queryKey: ['tables'],
    queryFn: tablesApi.getTables,
  });

  const [customerName, setCustomerName] = useState('');

  const selectedTable = preSelectedTableId
    ? tables.find((t) => t.id === preSelectedTableId)
    : null;

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: (newOrder) => {
      // Invalidate tables to update status on the UI
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      
      dispatch(clearCart());
      setCustomerName('');
      onClose();
      
      // Pass formatted order to parent for immediate display (receipt, etc)
      onOrderCreated({
        ...newOrder,
        staffName: currentUser?.displayName || 'Nhân viên',
        customerName: customerName || 'Khách lẻ',
        tableName: selectedTable?.name || 'Mang đi',
      });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Có lỗi khi tạo đơn hàng');
    },
  });

  const handleConfirm = () => {
    if (!currentUser) return;

    createOrderMutation.mutate({
      staffId: currentUser.id,
      tableId: preSelectedTableId,
      customerName: customerName.trim() || undefined,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận đơn hàng"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={items.length === 0}>
            Xác nhận — {formatVND(totalAmount)}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Customer name */}
        <Input
          label="Tên khách hàng"
          placeholder="Nhập tên (để trống = Khách lẻ)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          autoFocus
        />

        {/* Selected table info */}
        <div className="bg-surface-overlay/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{preSelectedTableId ? '🪑' : '🛍️'}</span>
            <div>
              <p className="text-sm font-semibold text-text">
                {selectedTable?.name || 'Mang đi'}
              </p>
              <p className="text-xs text-text-muted">
                {preSelectedTableId
                  ? `${selectedTable?.seats} chỗ ngồi — Đơn sẽ ở trạng thái "Đang phục vụ"`
                  : 'Đơn sẽ hoàn thành ngay'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-surface-overlay/50 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-text mb-2">Tóm tắt đơn hàng</h3>
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-text-muted">
                {item.product.image} {item.product.name} × {item.quantity}
              </span>
              <span className="text-text font-medium">{formatVND(item.subtotal)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Tổng cộng</span>
            <span className="font-bold text-primary-light">{formatVND(totalAmount)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
