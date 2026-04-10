import HyperswarmRPC from '@hyperswarm/rpc'
import c from 'compact-encoding'

import { getPriceHandler } from './handlers/getPrice';
import { pingHandler } from './handlers/ping';

export async function startRpcServer() {
    const rpc = new HyperswarmRPC({ valueEncoding: c.string })
    // RPC topics we got: getPrice, getPrices, getCapabilities, ping
    const server = rpc.createServer()

    await server.listen()
    const peerPubkeyHex = Buffer.from(server.publicKey).toString('hex')

    server.respond('getPrice', (reqRaw: string) => getPriceHandler(reqRaw, peerPubkeyHex))
    server.respond('ping', pingHandler)

    return {
        rpc,
        server,
        publicKey: server.publicKey,
    }
}