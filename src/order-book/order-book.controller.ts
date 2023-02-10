import { Controller, Get, Param } from '@nestjs/common';
import { OrderBookService } from './order-book.service';
import { GetOrderBookTipsParams } from './schemas/get-order-book-tips-params.dto';

@Controller('order-book')
export class OrderBookController {
  constructor(private readonly orderBookService: OrderBookService) {}

  @Get(':pair/tips')
  getOrderBookTips(@Param() params: GetOrderBookTipsParams) {
    return this.orderBookService.getOrderBookTips(params.pair);
  }
}
