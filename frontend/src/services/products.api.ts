import { api } from '@/lib/api';
import type { Product, Category } from '@/types';

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },
  
  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },
};
