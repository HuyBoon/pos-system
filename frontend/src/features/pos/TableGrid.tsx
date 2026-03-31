import { Users, ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';
import type { PosTable } from '@/types';

interface TableGridProps {
  selectedTableId: number | null;
  onSelect: (tableId: number | null) => void;
}

const statusConfig: Record<PosTable['status'], { color: string; label: string }> = {
  available: { color: 'border-success/40 bg-success/8 hover:border-success/60', label: 'Trống' },
  occupied:  { color: 'border-danger/40 bg-danger/8', label: 'Có khách' },
  reserved:  { color: 'border-warning/40 bg-warning/8', label: 'Đã đặt' },
};

export default function TableGrid({ selectedTableId, onSelect }: TableGridProps) {
  const { tables } = useAppSelector((state) => state.tables);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text flex items-center gap-2">
          <Users size={16} className="text-primary-light" />
          Chọn bàn
        </h3>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success" />
            Trống
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger" />
            Có khách
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning" />
            Đã đặt
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2">
        {/* Takeaway option */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'relative flex flex-col items-center justify-center px-3 py-3 rounded-xl text-sm font-medium',
            'border-2 transition-all duration-200 cursor-pointer',
            selectedTableId === null
              ? 'border-primary bg-primary/15 text-primary-light shadow-sm ring-1 ring-primary/20'
              : 'border-border bg-surface-raised text-text-muted hover:border-primary/30 hover:bg-surface-overlay'
          )}
        >
          <span className="text-lg mb-0.5">🛍️</span>
          <span className="text-xs font-semibold">Mang đi</span>
        </button>

        {tables.map((table) => {
          const config = statusConfig[table.status];
          const isAvailable = table.status === 'available';
          const isSelected = selectedTableId === table.id;

          return (
            <button
              key={table.id}
              onClick={() => isAvailable && onSelect(table.id)}
              disabled={!isAvailable}
              className={cn(
                'relative flex flex-col items-center justify-center px-3 py-3 rounded-xl text-sm font-medium',
                'border-2 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/15 text-primary-light shadow-sm ring-1 ring-primary/20'
                  : config.color,
                isAvailable
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-70'
              )}
            >
              {/* Status dot */}
              <span className={cn(
                'absolute top-1.5 right-1.5 w-2 h-2 rounded-full',
                table.status === 'available' && 'bg-success',
                table.status === 'occupied' && 'bg-danger animate-pulse',
                table.status === 'reserved' && 'bg-warning',
              )} />

              <span className="text-lg mb-0.5">🪑</span>
              <span className="text-xs font-semibold">{table.name}</span>
              <span className="text-[10px] text-text-muted mt-0.5">
                {table.seats} chỗ • {config.label}
              </span>

              {/* Order indicator for occupied tables */}
              {table.status === 'occupied' && table.currentOrderId && (
                <span className="text-[10px] text-danger font-medium mt-0.5 flex items-center gap-0.5">
                  #{table.currentOrderId} <ChevronRight size={10} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
