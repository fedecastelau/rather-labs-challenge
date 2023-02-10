import { Injectable } from "@nestjs/common";
import apiConfig from "./../config/config";
import { BitfinexOrderBookOrder } from "src/socket/bitfinex-book.type";
import { OrderBook, OrderBooksStore } from "./order-book-store.type";
import { OrderBookSidesEnum } from "./order-book.enums";


@Injectable()
export class OrderBookService {
    books: OrderBooksStore = {};

    constructor() {
        this.initOrderbooks();
    }

    initOrderbooks() {
        apiConfig.pairs.forEach(symbol => {
            const emptyOrderBook: OrderBook = {
                [OrderBookSidesEnum.BIDS]: {},
                [OrderBookSidesEnum.ASKS]: {},
                psnap: {
                    [OrderBookSidesEnum.BIDS]: [],
                    [OrderBookSidesEnum.ASKS]: []
                }
            };

            this.books[symbol] = emptyOrderBook;
        });
    }

    build(pair: string, orders: BitfinexOrderBookOrder[]) {
        orders.forEach(order => {
            let price = order[0];
            let count = order[1];
            let amount = order[2];

            const addOrUpdatePriceLevel = (count > 0);
            const deletePriceLevel = (count <= 0);
            let pp = { price, count, amount }


            // For more info about the algorithm: https://docs.bitfinex.com/reference/ws-public-books 
            if (addOrUpdatePriceLevel) {
                const side = amount >= 0 ? OrderBookSidesEnum.BIDS : OrderBookSidesEnum.ASKS;

                amount = Math.abs(amount);

                this.books[pair][side][price] = pp;
            } else {
                if (amount > 0) delete this.books[pair].bids[price];
                if (amount < 0) delete this.books[pair].asks[price];
            }

        });
    }


    buildSnapshot(pair: string) {
        [
            OrderBookSidesEnum.BIDS,
            OrderBookSidesEnum.ASKS,
        ].forEach((side) => {
            const book = this.books[pair][side];
            const bprices = Object.keys(book);

            const prices = bprices.sort((a, b) => {
                if (side === OrderBookSidesEnum.BIDS) {
                    return +a >= +b ? -1 : 1
                } else {
                    return +a <= +b ? -1 : 1
                }
            })

            this.books[pair].psnap[side] = prices;
        });
    }
}