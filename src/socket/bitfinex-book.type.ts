export type BitfinexOrderBook = [
  channelId: number,
  data: BitfinexOrderBookOrder[],
];

export type BitfinexOrderBookOrder = [
  price: number,
  count: number,
  amount: number,
];
