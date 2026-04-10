export interface GetPriceResponse {
    pair: string
    price: number
    timestamp: number
    server_time: number
    source_summary: { venue: string; kind: string; ts_ms?: number }[]
    peer_pubkey: string
}

export interface GetPriceRequest {
    pair: string
    options: {
        max_age_ms?: number
    }
}

export interface PingRequest {
    method: 'ping'
}

export interface PingResponse {
    server_time: number
    capabilities: string[]
}