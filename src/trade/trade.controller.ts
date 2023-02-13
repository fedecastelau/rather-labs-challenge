import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import apiConfig from './../config/config';
import { SimulateTradeBodyDto } from './dtos/simulate-trade-body.dto';
import { SimulateTradeParamsDto } from './dtos/simulate-trade-parms.dto';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {

  constructor(private readonly tradeService: TradeService) { }

  @Post(':pair/simulate')
  @ApiParam({ name: 'pair', enum: apiConfig.pairs })
  @ApiBody({ type: SimulateTradeBodyDto })
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
