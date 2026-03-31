import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: { category: true },
    });
  }

  async findAll(categoryId?: number) {
    const where = categoryId ? { categoryId } : {};

    return this.prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: { category: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.product.delete({ where: { id } });

    return { message: `Product with ID ${id} has been deleted` };
  }
}
