import { Module } from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { OrderBookModule } from './order-book/order-book.module';
import { TradeModule } from './trade/trade.module';

@Module({
  imports: [SocketModule, OrderBookModule, TradeModule],
})
export class AppModule {}
