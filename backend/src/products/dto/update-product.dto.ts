import { IsString, IsOptional, IsNumber, IsInt, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;
}
