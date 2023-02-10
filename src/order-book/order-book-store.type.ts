import { OrderBookSidesEnum } from './order-book.enums';

export type OrderBooksStore = {
  [key: string]: OrderBook;
};

export type OrderBookSnapshot = {
  [OrderBookSidesEnum.BIDS]: string[];
  [OrderBookSidesEnum.ASKS]: string[];
};

export type OrderBook = {
  [OrderBookSidesEnum.BIDS]: {
    [key: string]: { price: number; count: number; amount: number };
  };
  [OrderBookSidesEnum.ASKS]: {
    [key: string]: { price: number; count: number; amount: number };
  };
  psnap: OrderBookSnapshot;
};
