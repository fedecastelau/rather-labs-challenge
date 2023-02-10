import { Injectable } from "@nestjs/common";
import { BitfinexOrderBookOrder } from "src/socket/bitfinex-book.type";
import { OrderBook, OrderBooksStore } from "./store.type";



@Injectable()
export class OrderBookService {
    books: OrderBooksStore = {};

    constructor() {
        this.initOrderbooks();
    }

    initOrderbooks() {
        ['tBTCUSD', 'tETHUSD'].forEach(symbol => {
            const emptyOrderBook: OrderBook = {
                bids: {},
                asks: {},
                psnap: {
                    bids: {},
                    asks: {}
                }
            };

            this.books[symbol] = emptyOrderBook;
        });
    }

    handleMessage(symbol: string, orders: BitfinexOrderBookOrder[]) {
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

                this.books[symbol][side][price] = pp;
            }

            if (deletePriceLevel) {
                if (amount > 0) delete this.books[symbol].bids[price];
                if (amount < 0) delete this.books[symbol].asks[price];
            }
        });



    }

    getBySymbol(symbol: string) {
        ['bids', 'asks'].forEach((side) => {
            let sbook = this.books[symbol][side]
            let bprices = Object.keys(sbook)

            let prices = bprices.sort(function (a, b) {
                if (side === 'bids') {
                    return +a >= +b ? -1 : 1
                } else {
                    return +a <= +b ? -1 : 1
                }
            })

            this.books[symbol].psnap[side] = prices
        });

        return this.books[symbol].psnap;
    }
}