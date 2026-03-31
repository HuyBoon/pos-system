import { Users, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import type { PosTable } from '@/types';
import { tablesApi } from '@/services/tables.api';

interface TableGridProps {
  selectedTableId: number | null;
  onSelect: (tableId: number | null) => void;
}

const statusConfig: Record<PosTable['status'], { color: string; label: string }> = {
  AVAILABLE: { color: 'border-success/40 bg-success/8 hover:border-success/60', label: 'Trống' },
  OCCUPIED:  { color: 'border-danger/40 bg-danger/8', label: 'Có khách' },
  RESERVED:  { color: 'border-warning/40 bg-warning/8', label: 'Đã đặt' },
};

export default function TableGrid({ selectedTableId, onSelect }: TableGridProps) {
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: tablesApi.getTables,
  });

  if (isLoading) {
    return (
      <div className="h-32 flex items-center justify-center bg-surface-overlay/30 rounded-2xl border border-border border-dashed">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

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
          const isSelected = selectedTableId === table.id;

          return (
            <button
              key={table.id}
              onClick={() => table.status === 'AVAILABLE' && onSelect(table.id)}
              disabled={table.status !== 'AVAILABLE'}
              className={cn(
                'relative flex flex-col items-center justify-center px-3 py-3 rounded-xl text-sm font-medium',
                'border-2 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/15 text-primary-light shadow-sm ring-1 ring-primary/20'
                  : config.color,
                table.status === 'AVAILABLE'
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-70'
              )}
            >
              {/* Status dot */}
              <span className={cn(
                'absolute top-1.5 right-1.5 w-2 h-2 rounded-full',
                table.status === 'AVAILABLE' && 'bg-success',
                table.status === 'OCCUPIED' && 'bg-danger animate-pulse',
                table.status === 'RESERVED' && 'bg-warning',
              )} />

              <span className="text-lg mb-0.5">🪑</span>
              <span className="text-xs font-semibold">{table.name}</span>
              <span className="text-[10px] text-text-muted mt-0.5">
                {table.seats} chỗ • {config.label}
              </span>

              {/* Order indicator for occupied tables */}
              {table.status === 'OCCUPIED' && table.currentOrderId && (
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
