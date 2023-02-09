import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderBookService } from './order-book/order-book.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly orderBookService: OrderBookService,
  ) { }

  @Get()
  getHello() {
    // return this.orderBookService.get('test');
  }
}
