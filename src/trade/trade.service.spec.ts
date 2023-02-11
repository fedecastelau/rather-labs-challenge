import { Test, TestingModule } from '@nestjs/testing';
import { OrderBookModule } from './../order-book/order-book.module';
import { TradeService } from './trade.service';

describe('TradeService', () => {
  let service: TradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeService],
      imports: [OrderBookModule]
    }).compile();

    service = module.get<TradeService>(TradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
