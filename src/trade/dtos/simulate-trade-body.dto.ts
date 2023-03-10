import { IsEnum, IsNumber } from 'class-validator';
import { OperationTypesEnum } from '../enums/operation-types.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SimulateTradeBodyDto {
  @IsEnum(OperationTypesEnum)
  @ApiProperty({
    enum: OperationTypesEnum,
  })
  operation: OperationTypesEnum;

  @ApiProperty({
    description: `Limit price. Example: If current price of BTC is 20k, and you set a limit 21k, 
    the endpoint will buy orders lesser than 21k. 
    So, the limit must be greater than current price for buying and lesser for selling.`,
  })
  limit: number;

  @IsNumber()
  @ApiProperty({
    description: 'Amount of crypto',
  })
  amount: number;
}
