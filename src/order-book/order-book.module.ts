import { Module } from '@nestjs/common';
import { OrderBookService } from './order-book.service';
import { OrderBookController } from './order-book.controller';

@Module({
  providers: [OrderBookService],
  exports: [OrderBookService],
  controllers: [OrderBookController],
})
export class OrderBookModule {}
