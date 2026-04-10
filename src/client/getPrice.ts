import HyperswarmRPC from "@hyperswarm/rpc";
import c from 'compact-encoding'
import { GetPriceRequest, GetPriceResponse } from '../shared/protocol/messages'
import { parseHexPublicKey } from './helpers/parsers'

export async function getPrice() {
    const rpc = new HyperswarmRPC({ valueEncoding: c.string });
    const publicKey = parseHexPublicKey(process.argv[2])
    const req: GetPriceRequest = { pair: process.argv[3], options: { max_age_ms: 1000 } }
    const resRaw = (await rpc.request(publicKey, 'getPrice', JSON.stringify(req))) as string
    const res = JSON.parse(resRaw) as GetPriceResponse
    console.log(JSON.stringify(res, null, 2))
    await rpc.destroy({ force: true })
}

await getPrice()