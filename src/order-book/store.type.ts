export type OrderBooksStore = {
    [key: string]: OrderBook
}

export type OrderBook = {
    bids: {
        [key: string]: { price: number, count: number, amount: number }
    },
    asks: {
        [key: string]: { price: number, count: number, amount: number }
    },
    psnap: {
        bids: { [key: string]: number },
        asks: { [key: string]: number },
    }
}