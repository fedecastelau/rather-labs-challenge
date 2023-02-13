import { Injectable } from '@nestjs/common';
import { Order } from './../order-book/order-book-store.type';
import { OrderBookSidesEnum } from './../order-book/order-book.enums';
import { OrderBookService } from './../order-book/order-book.service';
import { OperationTypesEnum } from './enums/operation-types.enum';

type SimulateOperationArgs = {
  pair: string;
  operation: OperationTypesEnum;
  amount: number;
  limit?: number;
};

type SettingByOperationType = {
  [key in OperationTypesEnum]: {
    side: OrderBookSidesEnum;
    filterByLimit: (o: Order) => boolean;
  };
};

@Injectable()
export class TradeService {
  constructor(private readonly orderBookService: OrderBookService) {}

  simulateOperation({ pair, operation, amount, limit }: SimulateOperationArgs) {
    const trade = {
      totalPrice: 0,
      totalAmount: 0,
      pair,
      operation,
    };
    const orderBook = this.getOrderBook(pair, operation, limit);

    // Operate orders until the amount is completed
    for (let i = 0; i < orderBook.length && trade.totalAmount < amount; i++) {
      const order = orderBook[i];
      const orderAmount = Math.abs(order.amount);
      const lastOrderToCompleteTrade = trade.totalAmount + orderAmount > amount;

      if (lastOrderToCompleteTrade) {
        const remainingAmount = amount - trade.totalAmount;

        trade.totalAmount += remainingAmount;
        trade.totalPrice += remainingAmount * order.price;
      } else {
        trade.totalAmount += orderAmount;
        trade.totalPrice += orderAmount * order.price;
      }
    }

    return {
      ...trade,
      averagePrice: trade.totalPrice / trade.totalAmount,
    };
  }

  private getOrderBook(
    pair: string,
    operation: OperationTypesEnum,
    limit?: number,
  ): Order[] {
    const settingsByOperationType: SettingByOperationType = {
      [OperationTypesEnum.BUY]: {
        side: OrderBookSidesEnum.ASKS,
        filterByLimit: (o) => o.price <= limit,
      },
      [OperationTypesEnum.SELL]: {
        side: OrderBookSidesEnum.BIDS,
        filterByLimit: (o) => o.price >= limit,
      },
    };

    const settings = settingsByOperationType[operation];

    return this.orderBookService
      .getSnapshot(pair)
      [settings.side].filter(settings.filterByLimit);
  }
}
