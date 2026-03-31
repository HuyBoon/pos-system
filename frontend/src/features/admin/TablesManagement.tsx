import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, LayoutDashboard, Save, X, Users } from 'lucide-react';
import { Card, Button, Input, Table, Modal, Badge } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import { tablesApi } from '@/services/tables.api';
import type { PosTable } from '@/types';

export default function TablesManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<PosTable | null>(null);
  const [formData, setFormData] = useState<Partial<PosTable>>({
    name: '',
    seats: 4,
    status: 'AVAILABLE',
  });

  const queryClient = useQueryClient();

  // 1. Fetch data
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: tablesApi.getTables,
  });

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: tablesApi.createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PosTable> }) =>
      tablesApi.updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tablesApi.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });

  // 3. Handlers
  const handleOpenModal = (table?: PosTable) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        name: table.name,
        seats: table.seats,
        status: table.status,
      });
    } else {
      setEditingTable(null);
      setFormData({
        name: `Bàn ${tables.length + 1}`,
        seats: 4,
        status: 'AVAILABLE',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingTable) {
      updateMutation.mutate({ id: editingTable.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
      deleteMutation.mutate(id);
    }
  };

  // 4. Table Columns
  const columns: TableColumn<PosTable>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '80px',
      render: (t) => <span className="text-text-muted">#{t.id}</span>,
    },
    {
      key: 'name',
      header: 'Tên bàn',
      render: (t) => <span className="font-semibold text-text">{t.name}</span>,
    },
    {
      key: 'seats',
      header: 'Số chỗ ngồi',
      render: (t) => (
        <div className="flex items-center gap-1.5 text-text-muted">
          <Users size={14} />
          <span>{t.seats} chỗ</span>
        </div>
      ),
      width: '120px',
    },
    {
      key: 'status',
      header: 'Trạng thái hiện tại',
      width: '150px',
      render: (t) => {
        const variants: Record<string, any> = {
          AVAILABLE: 'success',
          OCCUPIED: 'danger',
          RESERVED: 'warning',
        };
        const labels: Record<string, string> = {
          AVAILABLE: 'Trống',
          OCCUPIED: 'Có khách',
          RESERVED: 'Đã đặt',
        };
        return (
          <Badge variant={variants[t.status]} dot size="sm">
            {labels[t.status]}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '120px',
      render: (t) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={<Edit size={14} />}
            onClick={() => handleOpenModal(t)}
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-danger hover:bg-danger/10"
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(t.id)}
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
            <LayoutDashboard size={22} className="text-primary-light" />
            Quản lý sơ đồ bàn
          </h1>
          <p className="text-sm text-text-muted mt-1">Quản lý không gian phục vụ</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus size={18} />}>
          Thêm bàn mới
        </Button>
      </div>

      <Card>
        <Card.Body className="p-0">
          <Table<PosTable>
            columns={columns}
            data={tables}
            isLoading={isLoading}
            keyExtractor={(t) => t.id}
          />
        </Card.Body>
      </Card>

      {/* Add/Edit Table Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTable ? 'Cập nhật thông tin bàn' : 'Thêm bàn mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Tên bàn</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên bàn (vd: Bàn 12)..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Số chỗ ngồi</label>
            <Input
              type="number"
              value={formData.seats}
              onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
              min="1"
              required
            />
          </div>
          {editingTable && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Trạng thái</label>
              <select
                className="w-full bg-surface-overlay/50 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary transition-all"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="AVAILABLE">Trống</option>
                <option value="OCCUPIED">Có khách</option>
                <option value="RESERVED">Đã đặt</option>
              </select>
            </div>
          )}

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
              {editingTable ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
