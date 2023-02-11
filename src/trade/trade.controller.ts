import { Body, Controller, Post } from '@nestjs/common';
import { SimulateTradeBodyDto } from './dtos/simulate-trade-body.dto';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {

  constructor(private readonly tradeService: TradeService) { }

  @Post('simulate')
  simulateTrade(@Body() body: SimulateTradeBodyDto) {
    return this.tradeService.simulateOperation(
      body
    )
  }
}
