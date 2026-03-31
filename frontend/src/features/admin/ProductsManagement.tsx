import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Package, Save, X, Search, Filter } from 'lucide-react';
import { Card, Button, Input, Table, Modal, Badge } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import { productsApi } from '@/services/products.api';
import { categoriesApi } from '@/services/categories.api';
import type { Product } from '@/types';
import { formatVND } from '@/lib/utils';

export default function ProductsManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    image: '📦',
  });

  const queryClient = useQueryClient();

  // 1. Fetch data
  const { data: products = [], isLoading: isLoadingProd } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts(),
  });

  const { data: categories = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productsApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // 3. Handlers
  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        image: product.image || '📦',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        stock: 0,
        categoryId: categories[0]?.id || 0,
        image: '📦',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) return;

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      deleteMutation.mutate(id);
    }
  };

  // 4. Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryId === null || p.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  // 5. Table Columns
  const columns: TableColumn<Product>[] = [
    {
      key: 'image',
      header: '',
      width: '50px',
      render: (p) => <span className="text-xl">{p.image || '📦'}</span>,
    },
    {
      key: 'name',
      header: 'Tên sản phẩm',
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text">{p.name}</span>
          <span className="text-[10px] text-text-muted">ID: {p.id}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Danh mục',
      render: (p) => {
        const cat = categories.find((c) => c.id === p.categoryId);
        return <Badge variant="info" size="sm">{cat?.name || 'Chưa phân loại'}</Badge>;
      },
    },
    {
      key: 'price',
      header: 'Giá bán',
      render: (p) => <span className="font-bold text-primary-light">{formatVND(p.price)}</span>,
      width: '130px',
    },
    {
      key: 'stock',
      header: 'Tồn kho',
      width: '100px',
      render: (p) => (
        <Badge
          variant={p.stock > 20 ? 'success' : (p.stock > 0 ? 'warning' : 'danger')}
          dot
          size="sm"
        >
          {p.stock}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '120px',
      render: (p) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={<Edit size={14} />}
            onClick={() => handleOpenModal(p)}
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-danger hover:bg-danger/10"
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(p.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2">
            <Package size={22} className="text-primary-light" />
            Quản lý thực đơn
          </h1>
          <p className="text-sm text-text-muted mt-1">Quản lý sản phẩm, giá bán và tồn kho</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus size={18} />}>
          Thêm sản phẩm
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm theo tên sản phẩm..."
            icon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-text-muted" />
          <select
            className="bg-surface-overlay/50 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary transition-all"
            value={selectedCategoryId || ''}
            onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <Card.Body className="p-0">
          <Table<Product>
            columns={columns}
            data={filteredProducts}
            isLoading={isLoadingProd || isLoadingCats}
            keyExtractor={(p) => p.id}
          />
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Tên sản phẩm</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên sản phẩm..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Danh mục</label>
              <select
                className="w-full bg-surface-overlay/50 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary transition-all"
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Giá bán (VND)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Tồn kho</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Emoji hình ảnh</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Nhập emoji (vd: ☕)"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={handleCloseModal} icon={<X size={18} />}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={createMutation.isPending || updateMutation.isPending}
              icon={<Save size={18} />}
            >
              {editingProduct ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
