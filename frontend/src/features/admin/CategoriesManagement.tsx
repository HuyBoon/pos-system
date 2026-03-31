import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, FolderEdit, Save, X } from 'lucide-react';
import { Card, Button, Input, Table, Modal } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import { categoriesApi } from '@/services/categories.api';
import type { Category } from '@/types';

export default function CategoriesManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const queryClient = useQueryClient();

  // 1. Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // 3. Handlers
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name });
    } else {
      setEditingCategory(null);
      setFormData({ name: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      deleteMutation.mutate(id);
    }
  };

  // 4. Table Columns
  const columns: TableColumn<Category>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '80px',
      render: (cat) => <span className="text-text-muted">#{cat.id}</span>,
    },
    {
      key: 'name',
      header: 'Tên danh mục',
      render: (cat) => <span className="font-medium text-text">{cat.name}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '120px',
      render: (cat) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={<Edit size={14} />}
            onClick={() => handleOpenModal(cat)}
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-danger hover:bg-danger/10"
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(cat.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2">
            <FolderEdit size={22} className="text-primary-light" />
            Quản lý danh mục
          </h1>
          <p className="text-sm text-text-muted mt-1">Phân loại sản phẩm cho thực đơn</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          icon={<Plus size={18} />}
        >
          Thêm danh mục
        </Button>
      </div>

      <Card>
        <Card.Body className="p-0">
          <Table<Category>
            columns={columns}
            data={categories}
            isLoading={isLoading}
            keyExtractor={(cat) => cat.id}
          />
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Tên danh mục</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên danh mục..."
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleCloseModal}
              icon={<X size={18} />}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={createMutation.isPending || updateMutation.isPending}
              icon={<Save size={18} />}
            >
              {editingCategory ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
