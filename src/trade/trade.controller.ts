import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderBookService } from './../order-book/order-book.service';
import apiConfig from './../config/config';
import { SimulateTradeBodyDto } from './dtos/simulate-trade-body.dto';
import { SimulateTradeParamsDto } from './dtos/simulate-trade-parms.dto';
import { OperationTypesEnum } from './enums/operation-types.enum';
import { TradeService } from './trade.service';

@ApiTags('Trading')
@Controller('trade')
export class TradeController {
  constructor(
    private readonly tradeService: TradeService,
    private readonly orderBookService: OrderBookService,
  ) {}

  @Post(':pair/simulate')
  @ApiParam({ name: 'pair', enum: apiConfig.pairs })
  @ApiBody({ type: SimulateTradeBodyDto })
  simulateTrade(
    @Param() params: SimulateTradeParamsDto,
    @Body() body: SimulateTradeBodyDto,
  ) {
    //Validate limit
    const orderBook = this.orderBookService.getOrderBookTips(params.pair);

    //validate buy
    if (
      body.operation === OperationTypesEnum.BUY &&
      body.limit < orderBook.tips.ask
    ) {
      throw new BadRequestException(
        `Limit must be greater than current price of ${params.pair}: ${orderBook.tips.ask}`,
      );
    }
    //validate sell
    if (
      body.operation === OperationTypesEnum.SELL &&
      body.limit > orderBook.tips.ask
    ) {
      throw new BadRequestException(
        `Limit must be lesser than current price of ${params.pair}: ${orderBook.tips.bid}`,
      );
    }

    return this.tradeService.simulateOperation({
      ...body,
      ...params,
    });
  }
}
