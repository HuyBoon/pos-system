import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (categoryId: number | null) => void;
}

export default function CategoryTabs({ categories, selectedCategoryId, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {/* All tab */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap',
          'transition-all duration-200 cursor-pointer border',
          selectedCategoryId === null
            ? 'bg-primary/15 text-primary-light border-primary/25 shadow-sm'
            : 'bg-surface-raised text-text-muted border-border hover:bg-surface-overlay hover:text-text'
        )}
      >
        <span className="text-base">🏪</span>
        Tất cả
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap',
            'transition-all duration-200 cursor-pointer border',
            selectedCategoryId === cat.id
              ? 'bg-primary/15 text-primary-light border-primary/25 shadow-sm'
              : 'bg-surface-raised text-text-muted border-border hover:bg-surface-overlay hover:text-text'
          )}
        >
          <span className="text-base">{cat.icon}</span>
          {cat.name}
        </button>
      ))}
    </div>
  );
}
