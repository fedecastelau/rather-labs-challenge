import { Body, Controller, Post } from '@nestjs/common';
import { SimulateTradeBodyDto } from './dtos/simulate-trade-body.dto';

@Controller('trade')
export class TradeController {
  @Post('simulate')
  simulateTrade(@Body() body: SimulateTradeBodyDto) {

  }
}
