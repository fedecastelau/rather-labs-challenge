import { IsEnum, IsIn, IsNumberString } from 'class-validator';
import apiConfig from './../../config/config';

export class GetOrderBookTipsParams {
  @IsIn(apiConfig.pairs)
  pair: string;
}
