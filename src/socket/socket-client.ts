import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NodeCompatibleEventEmitter } from "rxjs/internal/observable/fromEvent";
import { io, Socket } from 'socket.io-client';
import { OrderBookService } from "src/order-book/order-book.service";

import * as ws from 'ws';
import { BitfinexOrderBook } from "./bitfinex-book.type";

@Injectable()
export class SocketClient implements OnModuleInit {
    private readonly logger = new Logger(SocketClient.name);
    public socketClient: Socket;

    constructor(
        private readonly orderBookService: OrderBookService,
    ) {
        this.socketClient = new ws('wss://api-pub.bitfinex.com/ws/2');
    }

    onModuleInit() {
        this.socketClient.on('open', (open) => {
            this.logger.log('Connected to Bitfinex');

            let msg = JSON.stringify({
                event: 'subscribe',
                channel: 'book',
                symbol: 'tBTCUSD'
            })

            this.socketClient.send(msg)
        })

        this.socketClient.on('error', (error) => {
            this.logger.log('Connected to Bitfinex');
        });

        this.socketClient.on('message', (buffer: Buffer) => {
            const message: any | BitfinexOrderBook = JSON.parse(buffer.toString());

            if (Array.isArray(message)) {
                const isSnapshot = !(typeof message[1][0] === 'number')

                this.orderBookService.handleMessage(isSnapshot ? message[1] : [message[1]])
            }


        })
    }
}