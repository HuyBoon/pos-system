import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

// Initialize Prisma 7 connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin & Staff Users
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordStaff = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: passwordAdmin,
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      password: passwordStaff,
      role: 'STAFF',
    },
  });

  console.log('Created users:', admin.username, staff.username);

  // 2. Create Categories
  const catCoffee = await prisma.category.upsert({
    where: { id: 1 },
    update: { name: 'Cà phê' },
    create: { id: 1, name: 'Cà phê' },
  });

  const catTea = await prisma.category.upsert({
    where: { id: 2 },
    update: { name: 'Trà/Trai cây' },
    create: { id: 2, name: 'Trà/Trai cây' },
  });

  const catCake = await prisma.category.upsert({
    where: { id: 3 },
    update: { name: 'Bánh ngọt' },
    create: { id: 3, name: 'Bánh ngọt' },
  });

  const catOther = await prisma.category.upsert({
    where: { id: 4 },
    update: { name: 'Khác' },
    create: { id: 4, name: 'Khác' },
  });

  console.log('Created categories');

  // 3. Create Products
  const products = [
    { id: 1, name: 'Cà phê đen', price: 25000, categoryId: 1, stock: 100 },
    { id: 2, name: 'Cà phê sữa đá', price: 29000, categoryId: 1, stock: 100 },
    { id: 3, name: 'Bạc xỉu', price: 35000, categoryId: 1, stock: 100 },
    { id: 4, name: 'Trà đào cam sả', price: 45000, categoryId: 2, stock: 50 },
    { id: 5, name: 'Trà vải', price: 40000, categoryId: 2, stock: 50 },
    { id: 6, name: 'Trà ô long hạt sen', price: 49000, categoryId: 2, stock: 50 },
    { id: 7, name: 'Tiramisu', price: 45000, categoryId: 3, stock: 20 },
    { id: 8, name: 'Bánh sừng bò', price: 35000, categoryId: 3, stock: 20 },
    { id: 9, name: 'Su kem', price: 20000, categoryId: 3, stock: 30 },
    { id: 10, name: 'Nước suối', price: 15000, categoryId: 4, stock: 200 },
    { id: 11, name: 'Bò húc', price: 25000, categoryId: 4, stock: 150 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        categoryId: p.categoryId,
        stock: p.stock,
      },
      create: p,
    });
  }

  console.log('Created products');
  console.log('Database seeded successfully 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
