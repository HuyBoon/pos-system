import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(createTableDto: CreateTableDto) {
    return this.prisma.table.create({
      data: createTableDto,
    });
  }

  async findAll() {
    return this.prisma.table.findMany({
      orderBy: { id: 'asc' },
      include: {
        orders: {
          where: { status: 'PENDING' },
          take: 1,
        },
      },
    });
  }

  async findOne(id: number) {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    return table;
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    await this.findOne(id);

    return this.prisma.table.update({
      where: { id },
      data: updateTableDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.table.delete({
      where: { id },
    });

    return { message: `Table with ID ${id} has been deleted` };
  }
}
