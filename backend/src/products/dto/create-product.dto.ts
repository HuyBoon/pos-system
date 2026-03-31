import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsInt()
  categoryId: number;
}
