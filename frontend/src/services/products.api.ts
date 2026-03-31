import { api } from '@/lib/api';
import type { Product } from '@/types';

export const productsApi = {
  getProducts: async (categoryId?: number): Promise<Product[]> => {
    const { data } = await api.get('/products', { params: { categoryId } });
    return data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const { data } = await api.post('/products', product);
    return data;
  },

  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}`, product);
    return data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
