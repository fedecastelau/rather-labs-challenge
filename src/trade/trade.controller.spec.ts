import { Test, TestingModule } from '@nestjs/testing';
import { OrderBookModule } from './../order-book/order-book.module';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';

describe('TradeController', () => {
  let controller: TradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeController],
      providers: [TradeService],
      imports: [OrderBookModule],
    }).compile();

    controller = module.get<TradeController>(TradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
