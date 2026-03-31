import { ShoppingCart, Plus, Minus, Trash2, XCircle } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeItem, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { formatVND } from '@/lib/utils';

interface CartPanelProps {
  onCheckout: () => void;
  selectedTableId: number | null;
}

export default function CartPanel({ onCheckout, selectedTableId }: CartPanelProps) {
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalQuantity } = useAppSelector((state) => state.cart);
  const { tables } = useAppSelector((state) => state.tables);

  const selectedTable = selectedTableId
    ? tables.find((t) => t.id === selectedTableId)
    : null;

  return (
    <div className="flex flex-col h-full bg-surface-raised border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-primary-light" />
          <h2 className="text-base font-semibold">Giỏ hàng</h2>
          {totalQuantity > 0 && (
            <Badge variant="info" size="sm">{totalQuantity}</Badge>
          )}
        </div>
        {items.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            icon={<XCircle size={14} />}
            onClick={() => dispatch(clearCart())}
          >
            Xóa
          </Button>
        )}
      </div>

      {/* Table indicator */}
      <div className="px-4 py-2 bg-surface-overlay/30 border-b border-border/50 flex items-center gap-2 text-xs">
        <span>{selectedTableId ? '🪑' : '🛍️'}</span>
        <span className="font-medium text-text-muted">
          {selectedTable
            ? `${selectedTable.name} (${selectedTable.seats} chỗ)`
            : 'Mang đi'}
        </span>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted py-12">
            <ShoppingCart size={36} className="opacity-30 mb-3" />
            <p className="text-sm">Giỏ hàng trống</p>
            <p className="text-xs mt-1">Chọn sản phẩm để thêm</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {items.map((item) => (
              <div key={item.product.id} className="px-4 py-3 hover:bg-surface-overlay/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {item.product.image} {item.product.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatVND(item.product.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary-light whitespace-nowrap">
                    {formatVND(item.subtotal)}
                  </span>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({
                          productId: item.product.id,
                          quantity: item.quantity - 1,
                        }))
                      }
                      className="w-7 h-7 rounded-md bg-surface-overlay flex items-center justify-center
                                 hover:bg-surface-hover transition-colors cursor-pointer text-text-muted hover:text-text"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({
                          productId: item.product.id,
                          quantity: item.quantity + 1,
                        }))
                      }
                      className="w-7 h-7 rounded-md bg-surface-overlay flex items-center justify-center
                                 hover:bg-surface-hover transition-colors cursor-pointer text-text-muted hover:text-text"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeItem(item.product.id))}
                    className="w-7 h-7 rounded-md flex items-center justify-center
                               text-text-muted hover:text-danger hover:bg-danger/10
                               transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer — Total + Checkout */}
      {items.length > 0 && (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-surface/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-muted">Tổng cộng</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              {formatVND(totalAmount)}
            </span>
          </div>
          <Button size="lg" className="w-full" onClick={onCheckout}>
            Thanh toán
          </Button>
        </div>
      )}
    </div>
  );
}
