import type { PingRequest, PingResponse } from '../../../shared/protocol/messages'

export function pingHandler(requestRaw: string): string {
    // Transport encoding is a string; decode/encode JSON at the edge.
    const _request = JSON.parse(requestRaw) as PingRequest

    const response: PingResponse = {
        server_time: Date.now(),
        capabilities: [],
    }

    return JSON.stringify(response)
}