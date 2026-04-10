import { GetPriceResponse } from "./messages"

export function buildGetPriceResponseToSign(response: GetPriceResponse) {
    return {
        pair: response.pair,
        price: response.price,
        timestamp: response.timestamp,
        server_time: response.server_time,
        source_summary: response.source_summary,
        peer_pubkey: response.peer_pubkey,
    }
}