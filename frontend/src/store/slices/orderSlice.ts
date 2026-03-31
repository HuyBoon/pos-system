import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderState, CartItem } from '@/types';

const initialState: OrderState = {
  orders: [],
  nextOrderId: 1001,
};

interface CreateOrderPayload {
  staffId: number;
  staffName: string;
  customerName: string;
  tableId: number | null;
  tableName: string;
  items: CartItem[];
  totalAmount: number;
  status?: Order['status']; // default: PENDING for dine-in, COMPLETED for takeaway
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder(state, action: PayloadAction<CreateOrderPayload>) {
      const payload = action.payload;

      const order: Order = {
        id: state.nextOrderId,
        totalAmount: payload.totalAmount,
        // Dine-in → PENDING (table is occupied), Takeaway → COMPLETED immediately
        status: payload.status || (payload.tableId ? 'PENDING' : 'COMPLETED'),
        staffId: payload.staffId,
        staffName: payload.staffName,
        customerName: payload.customerName,
        tableId: payload.tableId,
        tableName: payload.tableName,
        items: payload.items.map((item, idx) => ({
          id: idx + 1,
          orderId: state.nextOrderId,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        createdAt: new Date().toISOString(),
      };

      state.orders.unshift(order); // newest first
      state.nextOrderId += 1;
    },

    completeOrder(state, action: PayloadAction<number>) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.status = 'COMPLETED';
        order.completedAt = new Date().toISOString();
      }
    },

    cancelOrder(state, action: PayloadAction<number>) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.status = 'CANCELLED';
        order.completedAt = new Date().toISOString();
      }
    },

    updateOrderStatus(
      state,
      action: PayloadAction<{ orderId: number; status: Order['status'] }>
    ) {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        if (action.payload.status !== 'PENDING') {
          order.completedAt = new Date().toISOString();
        }
      }
    },
  },
});

export const { createOrder, completeOrder, cancelOrder, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
