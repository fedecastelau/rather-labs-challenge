import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { OrderBookModule } from './order-book/order-book.module';
import { MarketController } from './market/market.controller';

@Module({
  imports: [SocketModule, OrderBookModule],
  controllers: [AppController, MarketController],
  providers: [AppService],
})
export class AppModule {}
