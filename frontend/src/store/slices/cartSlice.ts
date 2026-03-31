import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartState, Product } from '../../types';

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
};

function recalculateTotals(state: CartState): void {
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.product.price * existingItem.quantity;
      } else {
        state.items.push({
          product,
          quantity: 1,
          subtotal: product.price,
        });
      }

      recalculateTotals(state);
    },

    removeItem(state, action: PayloadAction<number>) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);
      recalculateTotals(state);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
      } else {
        const existingItem = state.items.find(
          (item) => item.product.id === productId
        );
        if (existingItem) {
          existingItem.quantity = quantity;
          existingItem.subtotal = existingItem.product.price * quantity;
        }
      }

      recalculateTotals(state);
    },

    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
