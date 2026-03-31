import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates an order within a Prisma transaction:
   * 1. Validates that all products exist and have sufficient stock
   * 2. Creates the Order + OrderItems
   * 3. Deducts stock for each product
   */
  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validate staff exists
      const staff = await tx.user.findUnique({
        where: { id: createOrderDto.staffId },
      });

      if (!staff) {
        throw new BadRequestException(
          `Staff with ID ${createOrderDto.staffId} not found`,
        );
      }

      // 2. Fetch all products and validate stock
      let totalAmount = 0;
      const orderItemsData: { productId: number; quantity: number; price: number }[] = [];

      for (const item of createOrderDto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
          );
        }

        // Lock the price at the time of sale
        const lineTotal = product.price * item.quantity;
        totalAmount += lineTotal;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 3. Create the order with items
      const order = await tx.order.create({
        data: {
          totalAmount,
          staffId: createOrderDto.staffId,
          tableId: createOrderDto.tableId || null,
          status: createOrderDto.tableId ? OrderStatus.PENDING : OrderStatus.COMPLETED,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          staff: {
            select: { id: true, username: true, role: true },
          },
        },
      });

      // 4. Deduct stock for each item
      for (const item of createOrderDto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return order;
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: {
          staff: {
            select: { id: true, username: true },
          },
          _count: {
            select: { items: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);

    return {
      orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        staff: {
          select: { id: true, username: true, role: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    // Prevent updating a cancelled order
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled order');
    }

    // If cancelling, restore stock
    if (updateOrderStatusDto.status === OrderStatus.CANCELLED) {
      await this.prisma.$transaction(async (tx) => {
        // Restore stock for all items
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }

        await tx.order.update({
          where: { id },
          data: { status: updateOrderStatusDto.status },
        });
      });

      return this.findOne(id);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status },
      include: {
        items: {
          include: { product: true },
        },
        staff: {
          select: { id: true, username: true, role: true },
        },
      },
    });
  }
}
