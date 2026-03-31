import type { ReactNode } from 'react';

/* ─── Column Definition ─── */
export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  width?: string;
}

/* ─── Table Props ─── */
interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T, index: number) => void;
  keyExtractor?: (row: T, index: number) => string | number;
  emptyMessage?: string;
  striped?: boolean;
  className?: string;
}

export default function Table<T>({
  columns,
  data,
  onRowClick,
  keyExtractor,
  emptyMessage = 'No data available',
  striped = true,
  className = '',
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-border ${className}`}>
      <table className="w-full text-sm">
        {/* ─── Header ─── */}
        <thead>
          <tr className="border-b border-border bg-surface-overlay/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  px-4 py-3 text-left font-semibold text-text-muted uppercase tracking-wider text-xs
                  ${col.headerClassName || ''}
                `}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* ─── Body ─── */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-text-muted"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="opacity-40"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = keyExtractor
                ? keyExtractor(row, index)
                : index;

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row, index)}
                  className={`
                    border-b border-border/50 last:border-b-0
                    transition-colors duration-150
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${
                      striped && index % 2 === 1
                        ? 'bg-surface-overlay/20'
                        : 'bg-transparent'
                    }
                    hover:bg-surface-hover/50
                  `}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-text ${col.className || ''}`}
                    >
                      {col.render(row, index)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
