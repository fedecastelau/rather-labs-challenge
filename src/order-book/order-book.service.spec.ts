import { Test, TestingModule } from '@nestjs/testing';
import { BitfinexOrderBookOrder } from 'src/socket/bitfinex-book.type';
import apiConfig from './../config/config';

import { OrderBookService } from './order-book.service';

const pairs = ['BTCUSD', 'ETHUSD', 'DOTUSD'];
jest.mocked(apiConfig).pairs = pairs;

describe('OrderBookService', () => {
  let service: OrderBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderBookService],
    }).compile();

    service = module.get<OrderBookService>(OrderBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(service.books).toBeDefined();
  });

  it('should init an order book for each pair', () => {
    expect(service.initOrderbooks.call.length).toEqual(1);
    expect(Object.keys(service.books).length).toEqual(pairs.length);
  });

  it('should add a new bid when count is > 0 and amount is > 0', () => {
    const newOrder: BitfinexOrderBookOrder = [1001, 1, 0.5];
    const [price, count, amount] = newOrder;

    service.build(pairs[0], [newOrder]);

    const bids = service.books[pairs[0]].bids;

    expect(bids[price]).toBeDefined();
    expect(bids[price].amount).toEqual(amount);
    expect(bids[price].price).toEqual(price);
    expect(bids[price].count).toEqual(count);
    expect(Object.keys(bids).length).toEqual(1);
  });

  it('should add a new bid when count is > 0 and amount is 0', () => {
    const newOrder: BitfinexOrderBookOrder = [1001, 1, 0];
    const [price, count, amount] = newOrder;

    service.build(pairs[0], [newOrder]);

    const bids = service.books[pairs[0]].bids;

    expect(bids[price]).toBeDefined();
    expect(bids[price].amount).toEqual(amount);
    expect(bids[price].price).toEqual(price);
    expect(bids[price].count).toEqual(count);
    expect(Object.keys(bids).length).toEqual(1);

    expect(Object.keys(service.books[pairs[1]].bids).length).toEqual(0);
  });

  it('should add a new ask when count is > 0 and amount < 0', () => {
    const newOrder: BitfinexOrderBookOrder = [1001, 1, -0.1];
    const [price, count, amount] = newOrder;

    service.build(pairs[0], [newOrder]);

    const asks = service.books[pairs[0]].asks;

    expect(asks[price]).toBeDefined();
    expect(asks[price].amount).toEqual(amount);
    expect(asks[price].price).toEqual(price);
    expect(asks[price].count).toEqual(count);
    expect(Object.keys(asks).length).toEqual(1);
  });

  it('should update a new ask when count is > 0 and amount < 0', () => {
    const newOrder: BitfinexOrderBookOrder = [1001, 1, -0.1];
    const updatedOrder: BitfinexOrderBookOrder = [1001, 1, -2];

    const [price] = newOrder;
    const [, , updatedAmount] = updatedOrder;

    // Create a new ask
    service.build(pairs[0], [newOrder]);

    const asks = service.books[pairs[0]].asks;

    // Update existing ask
    service.build(pairs[0], [updatedOrder]);

    expect(asks[price].amount).toEqual(updatedAmount);
    expect(Object.keys(asks).length).toEqual(1);
  });

  it('should delete an existing ask when count =< 0', () => {
    const newOrder: BitfinexOrderBookOrder = [1001, 1, -0.1];
    const orderToRemoveAsk: BitfinexOrderBookOrder = [1001, -1, -2];

    // Create a new ask
    service.build(pairs[0], [newOrder]);

    const asks = service.books[pairs[0]].asks;
    expect(Object.keys(asks).length).toEqual(1);

    // Delete existing ask
    service.build(pairs[0], [orderToRemoveAsk]);

    expect(Object.keys(asks).length).toEqual(0);
  });

  it('should delete an existing bid when count =< 0', () => {
    const newOrder: BitfinexOrderBookOrder = [1001, 1, 1];
    const orderToRemoveAsk: BitfinexOrderBookOrder = [1001, -1, 1];

    // Create a new bid
    service.build(pairs[0], [newOrder]);

    const bids = service.books[pairs[0]].bids;
    expect(Object.keys(bids).length).toEqual(1);

    // Delete existing bid
    service.build(pairs[0], [orderToRemoveAsk]);

    expect(Object.keys(bids).length).toEqual(0);
  });

  it('should add a new bulk of bids', () => {
    const newOrders: BitfinexOrderBookOrder[] = [
      [1001, 1, 0.5],
      [1002, 1, 0.1],
      [1003, 1, 0],
      [1004, 1, 1000],
    ];

    service.build(pairs[0], newOrders);

    const bids = service.books[pairs[0]].bids;

    expect(Object.keys(bids).length).toEqual(newOrders.length);
  });

  it('should add a new bulk of asks', () => {
    const newOrders: BitfinexOrderBookOrder[] = [
      [1001, 1, -1],
      [1002, 1, -0.1],
      [1003, 1, -1000],
      [1004, 1, -1.1],
    ];

    service.build(pairs[0], newOrders);

    const asks = service.books[pairs[0]].asks;

    expect(Object.keys(asks).length).toEqual(newOrders.length);
  });

  it('should add a new bulk of mixed orders', () => {
    const newOrders: BitfinexOrderBookOrder[] = [
      [1001, 1, -1],
      [1002, 1, 0],
      [1003, 1, 1],
      [1002, 1, -0.1],
      [1004, 1, 2],
    ];

    service.build(pairs[0], newOrders);

    const bids = service.books[pairs[0]].bids;
    const asks = service.books[pairs[0]].asks;

    expect(Object.keys(bids).length).toEqual(3);
    expect(Object.keys(asks).length).toEqual(2);
  });

  it('should build a sorted snapshot of current prices', () => {
    const newOrders: BitfinexOrderBookOrder[] = [
      [1001, 1, -1],
      [1002, 1, 0],
      [1003, 1, 1],
      [1002, 1, -0.1],
      [1004, 1, 2],
      [1004.4, 1, 2],
      [1001.1, 1, -1],
    ];

    service.build(pairs[0], newOrders);
    service.buildSnapshot(pairs[0]);

    const psnap = service.books[pairs[0]].psnap;

    expect(psnap.asks[0]).toEqual('1001');
    expect(psnap.asks[1]).toEqual('1001.1');
    expect(psnap.asks[2]).toEqual('1002');

    expect(psnap.bids[0]).toEqual('1004.4');
    expect(psnap.bids[1]).toEqual('1004');
    expect(psnap.bids[2]).toEqual('1003');
  });
});
