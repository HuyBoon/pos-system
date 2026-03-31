import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TableState, TableStatus } from '@/types';
import { initialTables } from '@/data/mockData';

const initialState: TableState = {
  tables: initialTables,
};

const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    /** Mark a table as occupied and link it to an order */
    occupyTable(
      state,
      action: PayloadAction<{ tableId: number; orderId: number }>
    ) {
      const table = state.tables.find((t) => t.id === action.payload.tableId);
      if (table) {
        table.status = 'occupied';
        table.currentOrderId = action.payload.orderId;
      }
    },

    /** Free a table (mark as available, clear order link) */
    freeTable(state, action: PayloadAction<number>) {
      const table = state.tables.find((t) => t.id === action.payload);
      if (table) {
        table.status = 'available';
        table.currentOrderId = null;
      }
    },

    /** Update table status (e.g., reserve) */
    setTableStatus(
      state,
      action: PayloadAction<{ tableId: number; status: TableStatus }>
    ) {
      const table = state.tables.find((t) => t.id === action.payload.tableId);
      if (table) {
        table.status = action.payload.status;
        if (action.payload.status === 'available') {
          table.currentOrderId = null;
        }
      }
    },
  },
});

export const { occupyTable, freeTable, setTableStatus } = tableSlice.actions;
export default tableSlice.reducer;
