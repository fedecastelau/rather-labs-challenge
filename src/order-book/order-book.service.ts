import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import apiConfig from './../config/config';
import { BitfinexOrderBookOrder } from 'src/socket/bitfinex-book.type';
import {
  OrderBook,
  OrderBookSnapshot,
  OrderBooksStore,
} from './order-book-store.type';
import { OrderBookSidesEnum } from './order-book.enums';

@Injectable()
export class OrderBookService {
  books: OrderBooksStore = {};

  constructor() {
    this.initOrderbooks();
  }

  initOrderbooks(): void {
    apiConfig.pairs.forEach((symbol) => {
      const emptyOrderBook: OrderBook = {
        [OrderBookSidesEnum.BIDS]: {},
        [OrderBookSidesEnum.ASKS]: {},
        psnap: {
          [OrderBookSidesEnum.BIDS]: [],
          [OrderBookSidesEnum.ASKS]: [],
        },
      };

      this.books[symbol] = emptyOrderBook;
    });
  }

  build(pair: string, orders: BitfinexOrderBookOrder[]): void {
    if (!Array.isArray(orders)) return;

    orders.forEach((order) => {
      const price = order[0];
      const count = order[1];
      const amount = order[2];

      const addOrUpdatePriceLevel = +count > 0;
      const pp = { price, count, amount };

      // For more info about the algorithm: https://docs.bitfinex.com/reference/ws-public-books
      if (addOrUpdatePriceLevel) {
        const side =
          amount >= 0 ? OrderBookSidesEnum.BIDS : OrderBookSidesEnum.ASKS;

        // amount = Math.abs(amount);

        this.books[pair][side][price] = pp;
      } else {
        // Delete price level
        const side =
          amount > 0 ? OrderBookSidesEnum.BIDS : OrderBookSidesEnum.ASKS;

        delete this.books[pair][side][price];
      }
    });
  }

  buildSnapshot(pair: string): void {
    [OrderBookSidesEnum.BIDS, OrderBookSidesEnum.ASKS].forEach((side) => {
      if (!this.books[pair])
        throw new HttpException(`Order book not found`, HttpStatus.NOT_FOUND);

      const book = this.books[pair][side];
      const prices = Object.keys(book);

      const sortedPrices = prices.sort((a, b) => {
        if (side === OrderBookSidesEnum.BIDS) {
          return +a >= +b ? -1 : 1;
        } else {
          return +a <= +b ? -1 : 1;
        }
      });

      this.books[pair].psnap[side] = sortedPrices.map(
        (p) => this.books[pair][side][p],
      );
    });
  }

  getSnapshot(pair: string): OrderBookSnapshot {
    this.buildSnapshot(pair);

    return this.books[pair].psnap;
  }

  getOrderBookTips(pair: string): { tips: { bid: number; ask: number } } {
    const snapshot = this.getSnapshot(pair);

    if (!snapshot.bids[0] || !snapshot.asks[0])
      throw new HttpException(`There' no tips yet`, HttpStatus.NOT_FOUND);

    return {
      tips: {
        bid: +snapshot.bids[0].price,
        ask: +snapshot.asks[0].price,
      },
    };
  }

  9;
}
