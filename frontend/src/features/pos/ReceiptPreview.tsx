import { Button, Modal } from '@/components/ui';
import type { Order } from '@/types';
import { formatVND, formatDateTime } from '@/lib/utils';
import { Printer, CheckCircle } from 'lucide-react';

interface ReceiptPreviewProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptPreview({ order, isOpen, onClose }: ReceiptPreviewProps) {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hóa đơn"
      size="sm"
      footer={
        <>
          <Button variant="secondary" icon={<Printer size={16} />} onClick={() => window.print()}>
            In hóa đơn
          </Button>
          <Button onClick={onClose}>
            Đóng
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Success header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={28} className="text-success" />
          </div>
          <h3 className="text-lg font-bold text-text">Đặt hàng thành công!</h3>
          <p className="text-sm text-text-muted mt-1">Đơn hàng #{order.id}</p>
        </div>

        {/* Receipt card */}
        <div className="bg-surface-overlay/50 rounded-xl p-4 space-y-3 font-mono text-sm">
          {/* Store info */}
          <div className="text-center border-b border-dashed border-border pb-3">
            <p className="font-bold text-text text-base">NZT Coffee & Tea</p>
            <p className="text-text-muted text-xs">Hệ thống quản lý bán hàng</p>
          </div>

          {/* Meta info */}
          <div className="space-y-1 text-text-muted">
            <div className="flex justify-between">
              <span>Mã ĐH:</span>
              <span className="text-text font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian:</span>
              <span className="text-text">{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Nhân viên:</span>
              <span className="text-text">{order.staffName}</span>
            </div>
            <div className="flex justify-between">
              <span>Khách hàng:</span>
              <span className="text-text">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Bàn:</span>
              <span className="text-text">{order.tableName}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-dashed border-border" />

          {/* Items */}
          <div className="space-y-1.5">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-text-muted">
                  {item.productName} ×{item.quantity}
                </span>
                <span className="text-text">{formatVND(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="border-t border-dashed border-border" />

          {/* Total */}
          <div className="flex justify-between text-base font-bold">
            <span className="text-text">TỔNG CỘNG</span>
            <span className="text-primary-light">{formatVND(order.totalAmount)}</span>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-dashed border-border pt-3">
            <p className="text-text-muted text-xs">Cảm ơn quý khách!</p>
            <p className="text-text-muted text-[10px] mt-0.5">Hẹn gặp lại 🎉</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
