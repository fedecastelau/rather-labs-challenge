import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { OrderBookModule } from './order-book/order-book.module';
import { TradeModule } from './trade/trade.module';

@Module({
  imports: [SocketModule, OrderBookModule, TradeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
