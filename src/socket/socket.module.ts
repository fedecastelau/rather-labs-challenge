import { Module } from '@nestjs/common';
import { OrderBookModule } from 'src/order-book/order-book.module';
import { BitfinexOrderBookSocket } from './bitfinex-order-book.socket';

@Module({
  imports: [OrderBookModule],
  providers: [BitfinexOrderBookSocket],
})
export class SocketModule {}
