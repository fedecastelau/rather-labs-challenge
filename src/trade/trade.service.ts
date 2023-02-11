import { Injectable } from '@nestjs/common';
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

    simulateOperation(args: SimulateOperationArgs) {
        const book = this.orderBookService.getSnapshot(args.pair);
    }
}
