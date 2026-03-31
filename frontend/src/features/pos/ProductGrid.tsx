import { Plus } from 'lucide-react';
import type { Product } from '@/types';
import { formatVND } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const dispatch = useAppDispatch();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-muted">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-sm">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => dispatch(addItem(product))}
          className="group flex flex-col bg-surface-raised border border-border rounded-xl p-4
                     hover:border-primary/30 hover:shadow-glow hover:-translate-y-0.5
                     transition-all duration-200 cursor-pointer text-left"
        >
          {/* Emoji icon */}
          <div className="w-12 h-12 rounded-xl bg-surface-overlay flex items-center justify-center
                          text-2xl mb-3 group-hover:scale-110 transition-transform duration-200">
            {product.image || '📦'}
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-text leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Price + Stock */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-sm font-bold text-primary-light">
              {formatVND(product.price)}
            </span>
            <Badge
              variant={product.stock > 20 ? 'success' : product.stock > 5 ? 'warning' : 'danger'}
              size="sm"
              dot
            >
              {product.stock}
            </Badge>
          </div>

          {/* Add overlay */}
          <div className="mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                          bg-primary/10 text-primary-light text-xs font-medium
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Plus size={14} />
            Thêm vào giỏ
          </div>
        </button>
      ))}
    </div>
  );
}
