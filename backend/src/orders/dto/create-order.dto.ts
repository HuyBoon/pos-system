import { Type } from 'class-transformer';
import {
  IsInt,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsInt()
  staffId: number;

  @IsInt()
  @IsOptional()
  tableId?: number | null;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
