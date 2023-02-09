import { Injectable, OnModuleInit } from "@nestjs/common";
import { BitfinexOrderBook, BitfinexOrderBookOrder } from "src/socket/bitfinex-book.type";



@Injectable()
export class OrderBookService {
    book = {
        bids: {},
        asks: {},
        psnap: {
            bids: {},
            asks: {}
        }
    };

    constructor() { }

    handleMessage(orders: BitfinexOrderBookOrder[]) {
        if (!Array.isArray(orders)) return;

        orders.forEach(order => {
            let price = order[0];
            let count = order[1];
            let amount = order[2];

            const addOrUpdatePriceLevel = (count > 0);
            const deletePriceLevel = (count <= 0);
            let pp = { price, count, amount }

            if (addOrUpdatePriceLevel) {
                const side = amount >= 0 ? 'bids' : 'asks'

                amount = Math.abs(amount);

                this.book[side][price] = pp;
            }

            if (deletePriceLevel) {
                if (amount > 0) delete this.book.bids[price];
                if (amount < 0) delete this.book.asks[price];
            }
        });
    }

    getOrderBookSnapshot() {
        ['bids', 'asks'].forEach((side) => {
            let sbook = this.book[side]
            let bprices = Object.keys(sbook)

            let prices = bprices.sort(function (a, b) {
                if (side === 'bids') {
                    return +a >= +b ? -1 : 1
                } else {
                    return +a <= +b ? -1 : 1
                }
            })

            this.book.psnap[side] = prices
        });

        return this.book.psnap;
    }
}