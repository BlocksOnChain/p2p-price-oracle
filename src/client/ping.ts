import HyperswarmRPC from '@hyperswarm/rpc'
import c from 'compact-encoding'
import { PingRequest, PingResponse } from '../shared/protocol/messages'

function parseHexPublicKey(hex: string): Uint8Array {
    const normalized = hex.trim().toLowerCase()
    if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
        throw new Error('Expected a hex public key (even-length, 0-9a-f).')
    }
    return Buffer.from(normalized, 'hex')
}

export async function ping() {
    const publicKeyHex = process.argv[2]
    if (!publicKeyHex) {
        throw new Error('Usage: bun run src/client/main.ts <peerPublicKeyHex>')
    }

    const rpc = new HyperswarmRPC({ valueEncoding: c.string })
    const publicKey = parseHexPublicKey(publicKeyHex)

    const req: PingRequest = { method: 'ping' }
    const resRaw = (await rpc.request(publicKey, 'ping', JSON.stringify(req))) as string
    const res = JSON.parse(resRaw) as PingResponse

    console.log(JSON.stringify(res, null, 2))
    await rpc.destroy({ force: true })
}

await ping()

