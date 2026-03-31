import { api } from '@/lib/api';
import type { Category } from '@/types';

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },

  getCategory: async (id: number): Promise<Category> => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const { data } = await api.post('/categories', category);
    return data;
  },

  updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
    const { data } = await api.patch(`/categories/${id}`, category);
    return data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
