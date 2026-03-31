import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types';

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ user: Omit<User, 'password'>; token: string }>
    ) {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout(state) {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
