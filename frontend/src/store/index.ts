import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type WebStorage,
} from 'redux-persist';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import tableReducer from './slices/tableSlice';

// Explicit localStorage adapter to avoid redux-persist ESM default export issue
const storage: WebStorage = {
  getItem(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'pos-system',
  storage,
  whitelist: ['cart', 'auth', 'orders', 'tables'],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  orders: orderReducer,
  tables: tableReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
