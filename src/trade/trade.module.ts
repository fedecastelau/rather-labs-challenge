import { Module } from '@nestjs/common';
import { OrderBookModule } from 'src/order-book/order-book.module';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';

@Module({
  controllers: [TradeController],
  providers: [TradeService],
  imports: [OrderBookModule],
})
export class TradeModule {}
