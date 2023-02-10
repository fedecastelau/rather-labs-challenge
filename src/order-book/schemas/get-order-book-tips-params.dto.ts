import { IsEnum, IsIn, IsNumberString } from 'class-validator';
import apiConfig from 'src/config/config';

export class GetOrderBookTipsParams {
  @IsIn(apiConfig.pairs)
  pair: string;
}
