import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Socket } from 'socket.io-client';
import { apiConfig } from "src/config/config";
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
        apiConfig.pairs.forEach(symbol => this.createConnection(symbol))
    }

    createConnection(symbol: string) {
        this.connections[symbol] = new ws(apiConfig.bitfinex.socket.book.url);

        this.connections[symbol].on('open', () => {
            const orderBookSocketConfig = apiConfig.bitfinex.socket.book;

            this.logger.log(`Connected to Bitfinex - Listening order book - ${symbol}`);

            this.connections[symbol].send(JSON.stringify({
                event: orderBookSocketConfig.event,
                channel: orderBookSocketConfig.channel,
                pair: symbol,
                prec: orderBookSocketConfig.prec,
                freq: orderBookSocketConfig.freq,
                len: orderBookSocketConfig.length
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