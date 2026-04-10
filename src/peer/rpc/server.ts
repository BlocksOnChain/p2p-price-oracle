import HyperswarmRPC from '@hyperswarm/rpc'
import c from 'compact-encoding'

import { getPriceHandler } from './handlers/getPrice';
import { pingHandler } from './handlers/ping';

export async function startRpcServer() {
    const rpc = new HyperswarmRPC({ valueEncoding: c.string })
    // RPC topics we got: getPrice, getPrices, getCapabilities, ping
    const server = rpc.createServer()

    server.respond('getPrice', getPriceHandler)
    server.respond('ping', pingHandler)

    await server.listen()

    return {
        rpc,
        server,
        publicKey: server.publicKey,
    }
}