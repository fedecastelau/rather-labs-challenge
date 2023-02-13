import { IsEnum, IsIn, IsNumberString } from 'class-validator';
import apiConfig from '../../config/config';

export class SimulateTradeParamsDto {
  @IsIn(apiConfig.pairs)
  pair: string;
}
