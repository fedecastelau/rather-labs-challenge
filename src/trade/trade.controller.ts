import { Body, Controller, Param, Post } from '@nestjs/common';
import { SimulateTradeBodyDto } from './dtos/simulate-trade-body.dto';
import { SimulateTradeParamsDto } from './dtos/simulate-trade-parms.dto';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {

  constructor(private readonly tradeService: TradeService) { }

  @Post(':pair/simulate')
  simulateTrade(
    @Param() params: SimulateTradeParamsDto,
    @Body() body: SimulateTradeBodyDto
  ) {
    return this.tradeService.simulateOperation({
      ...body,
      ...params
    })
  }
}
