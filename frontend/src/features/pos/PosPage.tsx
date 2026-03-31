import { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui';
import type { Order } from '@/types';
import { productsApi } from '@/services/products.api';
import { categoriesApi } from '@/services/categories.api';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import CartPanel from './CartPanel';
import TableGrid from './TableGrid';
import CheckoutModal from './CheckoutModal';
import ReceiptPreview from './ReceiptPreview';

export default function PosPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Fetch data
  const { data: categories = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts(),
  });

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategoryId !== null) {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    return result;
  }, [products, selectedCategoryId, searchQuery]);

  const handleOrderCreated = (order: Order) => {
    setReceiptOrder(order);
    setShowReceipt(true);
    setSelectedTableId(null); // Reset table selection after order
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-6.5rem)]">
      {/* Left panel — Tables + Products */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Fixed top section — never collapses */}
        <div className="shrink-0 space-y-4 pb-3 overflow-y-auto max-h-[45%] pr-1">
          <TableGrid
            selectedTableId={selectedTableId}
            onSelect={setSelectedTableId}
          />
        </div>

        {/* Divider */}
        <div className="shrink-0 border-t border-border" />

        {/* Search + Category — always visible */}
        <div className="shrink-0 flex items-center gap-4 py-3">
          <Input
            placeholder="Tìm sản phẩm..."
            icon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="shrink-0">
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>

        {/* Product Grid — scrollable */}
        <div className="flex-1 overflow-y-auto mt-3 pr-1 relative">
          {isLoadingCats || isLoadingProducts ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>

      {/* Right panel — Cart */}
      <div className="w-[340px] shrink-0">
        <CartPanel
          onCheckout={() => setShowCheckout(true)}
          selectedTableId={selectedTableId}
        />
      </div>

      {/* Modals */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onOrderCreated={handleOrderCreated}
        preSelectedTableId={selectedTableId}
      />

      <ReceiptPreview
        order={receiptOrder}
        isOpen={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          setReceiptOrder(null);
        }}
      />
    </div>
  );
}
