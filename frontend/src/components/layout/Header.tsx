import { Coffee, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';

export default function Header() {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { tables } = useAppSelector((state) => state.tables);
  const availableTables = tables.filter((t) => t.status === 'AVAILABLE').length;

  return (
    <header className="h-16 border-b border-border bg-surface-raised flex items-center justify-between px-6">
      {/* Left — Store name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Coffee size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-text leading-none">
            NZT Coffee & Tea
          </h1>
          <p className="text-[11px] text-text-muted leading-tight mt-0.5">
            Point of Sale System
          </p>
        </div>
      </div>

      {/* Right — Staff info + status */}
      <div className="flex items-center gap-4">
        {/* Available tables */}
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Users size={15} />
          <span>
            <span className="font-semibold text-text">{availableTables}</span>
            /{tables.length} bàn trống
          </span>
        </div>

        {/* Shift status */}
        <Badge variant="success" dot size="sm">
          <Clock size={11} className="mr-0.5" />
          Đang làm việc
        </Badge>

        {/* Staff name */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-light">
                {(currentUser.displayName || currentUser.username).charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-text leading-none">
                {currentUser.displayName || currentUser.username}
              </p>
              <p className="text-[10px] text-text-muted leading-tight mt-0.5">
                {currentUser.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
