import { Module } from "@nestjs/common";
import { OrderBookModule } from "src/order-book/order-book.module";

import { SocketClient } from "./socket-client";

@Module({
    imports: [OrderBookModule],
    providers: [SocketClient]
})
export class SocketModule { }