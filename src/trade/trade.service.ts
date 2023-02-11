import { Injectable } from '@nestjs/common';
import { OrderBookSidesEnum } from 'src/order-book/order-book.enums';
import { OrderBookService } from './../order-book/order-book.service';
import { OperationTypesEnum } from './enums/operation-types.enum';

type SimulateOperationArgs = {
    pair: string,
    operation: OperationTypesEnum,
    limit: number,
    amount: number
}

@Injectable()
export class TradeService {
    constructor(private readonly orderBookService: OrderBookService) { }

    simulateOperation({ pair, operation, amount, limit }: SimulateOperationArgs) {
        const trade = {
            totalPrice: 0,
            totalAmount: 0,
            pair,
            orders: [],
            operation,
            effectivePrice: null,

        };

        const orderBookSnapshot = this.orderBookService.getSnapshot(pair);
        const orderBookSide = (operation === OperationTypesEnum.BUY) ?
            orderBookSnapshot.asks : orderBookSnapshot.bids;

        for (let i = 0; (i < orderBookSide.length && trade.totalAmount < amount); i++) {
            const order = orderBookSide[i];
            const orderAmount = Math.abs(order.amount);
            const lastOrderToCompleteTrade = (trade.totalAmount + orderAmount > amount);

            if (lastOrderToCompleteTrade) {
                const remainingAmount = amount - trade.totalAmount;

                trade.totalAmount += remainingAmount;
                trade.totalPrice += remainingAmount * order.price;

                trade.orders.push({
                    ...order,
                    amount: remainingAmount
                });
            } else {
                trade.totalAmount += orderAmount;
                trade.totalPrice += orderAmount * order.price;

                trade.orders.push({
                    ...order,
                    amount: orderAmount
                });
            }
        }

        return {
            ...trade,
            averagePrice: trade.totalPrice / trade.totalAmount,
        };
    }
}
