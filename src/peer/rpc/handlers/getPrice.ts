import type { GetPriceRequest, GetPriceResponse } from '../../../shared/protocol/messages'

export function getPriceHandler(requestRaw: string, peerPubkeyHex: string): string {
    const request = JSON.parse(requestRaw) as GetPriceRequest

    const response: GetPriceResponse = {
        pair: request.pair,
        price: 100,
        timestamp: Date.now(),
        server_time: Date.now(),
        source_summary: [],
        peer_pubkey: peerPubkeyHex,
    }

    return JSON.stringify(response)
}