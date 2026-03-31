import { api } from '@/lib/api';
import type { PosTable } from '@/types';

export const tablesApi = {
  getTables: async (): Promise<PosTable[]> => {
    const { data } = await api.get('/tables');
    return data;
  },

  getTable: async (id: number): Promise<PosTable> => {
    const { data } = await api.get(`/tables/${id}`);
    return data;
  },

  createTable: async (table: Partial<PosTable>): Promise<PosTable> => {
    const { data } = await api.post('/tables', table);
    return data;
  },

  updateTable: async (id: number, table: Partial<PosTable>): Promise<PosTable> => {
    const { data } = await api.patch(`/tables/${id}`, table);
    return data;
  },

  deleteTable: async (id: number): Promise<void> => {
    await api.delete(`/tables/${id}`);
  },
};
