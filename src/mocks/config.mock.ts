import { ApiConfig } from "src/config/config";

const apiConfigMock: ApiConfig = {
    port: 3000,
    bitfinex: {
        socket: {
            book: {
                url: '',
                length: 25,
                freq: '',
                prec: '',
                channel: '',
                event: '',
            },
            market: ''
        }
    },
    pairs: ['tBTCUSD', 'tETHUSD']
}

export default apiConfigMock;