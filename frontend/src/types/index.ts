// ─── Shared TypeScript interfaces mirroring backend Prisma models ───

export interface Category {
  id: number;
  name: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  barcode?: string | null;
  image?: string; // emoji or image URL
  categoryId: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number; // price × quantity
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number; // Locked price at time of sale
  productName: string;
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  staffId: number;
  staffName: string;
  customerName: string;
  tableId: number | null;
  tableName: string;
  items: OrderItem[];
  createdAt: string;
  completedAt?: string;
}

export interface OrderState {
  orders: Order[];
  nextOrderId: number;
}

export type UserRole = 'ADMIN' | 'STAFF';

export interface User {
  id: number;
  username: string;
  password?: string; // mock only — never in production
  displayName?: string;
  role: UserRole;
}

export interface AuthState {
  currentUser: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  token: string | null;
}

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface PosTable {
  id: number;
  name: string;
  seats: number;
  status: TableStatus;
  currentOrderId: number | null; // Link to active order when occupied
}

export interface TableState {
  tables: PosTable[];
}
