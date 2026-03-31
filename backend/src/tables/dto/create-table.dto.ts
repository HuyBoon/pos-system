import { IsString, IsInt, Min, IsEnum, IsOptional } from 'class-validator';
import { TableStatus } from '@prisma/client';

export class CreateTableDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  seats?: number;

  @IsEnum(TableStatus)
  @IsOptional()
  status?: TableStatus;
}
