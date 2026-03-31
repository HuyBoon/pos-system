import type { Category, Product, PosTable, User } from '@/types';

// ─── Categories ───
export const categories: Category[] = [
  { id: 1, name: 'Cà phê & Trà', icon: '☕' },
  { id: 2, name: 'Đồ ăn', icon: '🍔' },
  { id: 3, name: 'Tráng miệng', icon: '🍰' },
  { id: 4, name: 'Nước ép & Sinh tố', icon: '🥤' },
];

// ─── Products (16 items, 4 per category) ───
export const products: Product[] = [
  // ── Cà phê & Trà (categoryId: 1) ──
  { id: 1,  name: 'Cà phê sữa đá',     price: 29000,  stock: 50, image: '☕', categoryId: 1 },
  { id: 2,  name: 'Cà phê đen',         price: 25000,  stock: 45, image: '☕', categoryId: 1 },
  { id: 3,  name: 'Trà đào cam sả',     price: 35000,  stock: 30, image: '🍑', categoryId: 1 },
  { id: 4,  name: 'Trà sữa trân châu',  price: 38000,  stock: 25, image: '🧋', categoryId: 1 },

  // ── Đồ ăn (categoryId: 2) ──
  { id: 5,  name: 'Bánh mì thịt',       price: 25000,  stock: 20, image: '🥖', categoryId: 2 },
  { id: 6,  name: 'Cơm gà xối mỡ',     price: 45000,  stock: 15, image: '🍗', categoryId: 2 },
  { id: 7,  name: 'Phở bò tái',         price: 50000,  stock: 12, image: '🍜', categoryId: 2 },
  { id: 8,  name: 'Mì xào hải sản',     price: 48000,  stock: 10, image: '🦐', categoryId: 2 },

  // ── Tráng miệng (categoryId: 3) ──
  { id: 9,  name: 'Bánh flan',          price: 18000,  stock: 40, image: '🍮', categoryId: 3 },
  { id: 10, name: 'Chè bưởi',           price: 22000,  stock: 30, image: '🍨', categoryId: 3 },
  { id: 11, name: 'Kem dừa',            price: 20000,  stock: 25, image: '🍦', categoryId: 3 },
  { id: 12, name: 'Bánh tiramisu',      price: 35000,  stock: 15, image: '🎂', categoryId: 3 },

  // ── Nước ép & Sinh tố (categoryId: 4) ──
  { id: 13, name: 'Nước ép cam',        price: 32000,  stock: 25, image: '🍊', categoryId: 4 },
  { id: 14, name: 'Sinh tố bơ',         price: 40000,  stock: 15, image: '🥑', categoryId: 4 },
  { id: 15, name: 'Sinh tố dâu',        price: 38000,  stock: 20, image: '🍓', categoryId: 4 },
  { id: 16, name: 'Nước ép dưa hấu',    price: 28000,  stock: 35, image: '🍉', categoryId: 4 },
];

// ─── Initial Tables (10 tables) ───
export const initialTables: PosTable[] = [
  { id: 1,  name: 'Bàn 1',  seats: 2, status: 'available', currentOrderId: null },
  { id: 2,  name: 'Bàn 2',  seats: 4, status: 'available', currentOrderId: null },
  { id: 3,  name: 'Bàn 3',  seats: 4, status: 'available', currentOrderId: null },
  { id: 4,  name: 'Bàn 4',  seats: 6, status: 'available', currentOrderId: null },
  { id: 5,  name: 'Bàn 5',  seats: 2, status: 'available', currentOrderId: null },
  { id: 6,  name: 'Bàn 6',  seats: 8, status: 'available', currentOrderId: null },
  { id: 7,  name: 'Bàn 7',  seats: 4, status: 'reserved',  currentOrderId: null },
  { id: 8,  name: 'Bàn 8',  seats: 2, status: 'available', currentOrderId: null },
  { id: 9,  name: 'Bàn 9',  seats: 6, status: 'available', currentOrderId: null },
  { id: 10, name: 'Bàn 10', seats: 4, status: 'available', currentOrderId: null },
];

// ─── Staff (mock credentials) ───
export const staff: User[] = [
  { id: 1, username: 'admin', password: 'admin123', displayName: 'Huy (Admin)',  role: 'ADMIN' },
  { id: 2, username: 'staff', password: 'staff123', displayName: 'Lan (Staff)',  role: 'STAFF' },
];
