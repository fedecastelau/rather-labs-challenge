import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io-client';
import * as ws from 'ws';

import apiConfig from './../config/config';
import { OrderBookService } from 'src/order-book/order-book.service';
import { BitfinexOrderBookOrder } from './bitfinex-book.type';

@Injectable()
export class BitfinexOrderBookSocket {
  private readonly logger = new Logger(BitfinexOrderBookSocket.name);
  private connections: { [key: string]: Socket } = {};

  constructor(private readonly orderBookService: OrderBookService) {
    apiConfig.pairs.forEach((pair) => this.createConnection(pair));
  }

  createConnection(pair: string) {
    const bookConfig = apiConfig.bitfinex.socket.book;
    const c = (this.connections[pair] = new ws(bookConfig.url));

    c.on('open', () => {
      this.logger.log(`Connected to Bitfinex - Listening order book - ${pair}`);

      c.send(
        JSON.stringify({
          event: bookConfig.event,
          channel: bookConfig.channel,
          pair: pair,
          prec: bookConfig.prec,
          freq: bookConfig.freq,
          len: bookConfig.length,
        }),
      );
    });

    c.on('error', (err) => {
      this.logger.log(`An unexpected error has occurred - ${pair}`, err);
    });

    c.on('message', (buffer: Buffer) => {
      const message: object | Array<number | number[]> = JSON.parse(
        buffer.toString(),
      );
      const isAValidSetOfOrders =
        Array.isArray(message) && Array.isArray(message[1]);

      if (isAValidSetOfOrders) {
        const isSnapshotOrBulk: boolean = typeof message[1][0] === 'object';
        const orders: BitfinexOrderBookOrder[] = isSnapshotOrBulk
          ? message[1]
          : [message[1]];

        this.orderBookService.build(pair, orders);
      }
    });
  }
}
