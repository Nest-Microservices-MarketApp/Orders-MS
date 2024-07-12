import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(20)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
