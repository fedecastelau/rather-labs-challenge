import { OrderBookSidesEnum } from './order-book.enums';

export type OrderBooksStore = {
  [key: string]: OrderBook;
};

export type Order = { price: number; count: number; amount: number };

export type OrderBookSnapshot = {
  [OrderBookSidesEnum.BIDS]: Order[];
  [OrderBookSidesEnum.ASKS]: Order[];
};

export type OrderBook = {
  [OrderBookSidesEnum.BIDS]: {
    [key: string]: Order;
  };
  [OrderBookSidesEnum.ASKS]: {
    [key: string]: Order;
  };
  psnap: OrderBookSnapshot;
};
