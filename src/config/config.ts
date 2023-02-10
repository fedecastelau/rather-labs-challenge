import * as dotenv from 'dotenv';

dotenv.config();

export type ApiConfig = {
  port: number;
  bitfinex: {
    socket: {
      book: {
        url: string;
        length: number;
        freq: string;
        prec: string;
        event: string;
        channel: string;
      };
      market: string;
    };
  };
  pairs: string[];
};

const apiConfig: ApiConfig = {
  port: +process.env.PORT,
  bitfinex: {
    socket: {
      book: {
        url: process.env.BITFINEX_SOCKET_URL,
        length: +process.env.ORDER_BOOK_LENGTH,
        freq: process.env.ORDER_BOOK_FREQUENCY,
        prec: process.env.ORDER_BOOK_PRECISION,
        channel: process.env.ORDER_BOOK_CHANNEL,
        event: process.env.ORDER_BOOK_EVENT,
      },
      market: '',
    },
  },
  pairs: process.env.ORDER_BOOK_PAIRS.split(' '),
};

export default apiConfig;
