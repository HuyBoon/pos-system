import { api } from '@/lib/api';
import type { Order } from '@/types';

export interface CreateOrderDto {
  staffId: number;
  tableId?: number | null;
  customerName?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export const ordersApi = {
  getOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<{ orders: Order[]; meta: any }>('/orders');
    return data.orders;
  },
  
  createOrder: async (order: CreateOrderDto): Promise<Order> => {
    const { data } = await api.post('/orders', order);
    return data;
  },
  
  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  }
};
