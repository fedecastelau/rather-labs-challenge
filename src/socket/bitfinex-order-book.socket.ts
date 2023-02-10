import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NodeCompatibleEventEmitter } from "rxjs/internal/observable/fromEvent";
import { io, Socket } from 'socket.io-client';
import { OrderBookService } from "src/order-book/order-book.service";

import * as ws from 'ws';
import { BitfinexOrderBook } from "./bitfinex-book.type";



@Injectable()
export class BitfinexOrderBookSocket {
    private readonly logger = new Logger(BitfinexOrderBookSocket.name);
    public connections: { [key: string]: Socket } = {};

    constructor(
        private readonly orderBookService: OrderBookService,
    ) {
        ['tBTCUSD', 'tETHUSD'].forEach(symbol => this.createConnection(symbol))
    }

    createConnection(symbol: string) {
        this.connections[symbol] = new ws('wss://api-pub.bitfinex.com/ws/2');

        this.connections[symbol].on('open', (open) => {
            this.logger.log(`Connected to Bitfinex - Listening order book - ${symbol}`);

            this.connections[symbol].send(JSON.stringify({ event: 'conf', flags: 65536 + 131072 }))
            this.connections[symbol].send(JSON.stringify({
                event: 'subscribe',
                channel: 'book',
                pair: symbol,
                prec: 'P0',
                freq: 'F0',
                len: 25
            }));
        });

        this.connections[symbol].on('error', (error) => {
            this.logger.log(`An unexpected error has occurred - ${symbol}`);
        });

        this.connections[symbol].on('message', (buffer: Buffer) => {
            const message: any | BitfinexOrderBook = JSON.parse(buffer.toString());

            if (Array.isArray(message)) {
                const isSnapshot = !(typeof message[1][0] === 'number')

                this.orderBookService.handleMessage(symbol, isSnapshot ? message[1] : [message[1]])
            }


        })
    }
}