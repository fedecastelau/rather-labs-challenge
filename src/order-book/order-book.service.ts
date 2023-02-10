import { Injectable } from '@nestjs/common';

import apiConfig from './../config/config';
import { BitfinexOrderBookOrder } from 'src/socket/bitfinex-book.type';
import { OrderBook, OrderBooksStore } from './order-book-store.type';
import { OrderBookSidesEnum } from './order-book.enums';

@Injectable()
export class OrderBookService {
  books: OrderBooksStore = {};

  constructor() {
    this.initOrderbooks();
  }

  initOrderbooks() {
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

    setInterval(() => {
      console.log(this.books);
      this.buildSnapshot('tBTCUSD');
      this.buildSnapshot('tETHUSD');
    }, 4000);
  }

  build(pair: string, orders: BitfinexOrderBookOrder[]) {
    if (!Array.isArray(orders)) return;

    orders.forEach((order) => {
      const price = order[0];
      const count = order[1];
      let amount = order[2];

      const addOrUpdatePriceLevel = +count > 0;
      const pp = { price, count, amount };

      // For more info about the algorithm: https://docs.bitfinex.com/reference/ws-public-books
      if (addOrUpdatePriceLevel) {
        const side =
          amount >= 0 ? OrderBookSidesEnum.BIDS : OrderBookSidesEnum.ASKS;

        amount = Math.abs(amount);

        this.books[pair][side][price] = pp;
      } else {
        /* NOTE: I assume that amount is a number and could be a 0 because the documentation 
                    doesn't clarify this case.
                */

        // Delete price level
        if (amount > 0) delete this.books[pair].bids[price];
        if (amount < 0) delete this.books[pair].asks[price];
      }
    });
  }

  buildSnapshot(pair: string) {
    [OrderBookSidesEnum.BIDS, OrderBookSidesEnum.ASKS].forEach((side) => {
      const book = this.books[pair][side];
      const prices = Object.keys(book);

      const sortedPrices = prices.sort((a, b) => {
        if (side === OrderBookSidesEnum.BIDS) {
          return +a >= +b ? -1 : 1;
        } else {
          return +a <= +b ? -1 : 1;
        }
      });

      this.books[pair].psnap[side] = sortedPrices;
    });
  }

  getSnapshot(pair: string) {
    this.buildSnapshot(pair);

    return this.books[pair].psnap;
  }
}
