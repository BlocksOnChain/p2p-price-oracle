import { startRpcServer } from './rpc/server'

export async function main() {
  const { publicKey } = await startRpcServer()
  const publicKeyHex = Buffer.from(publicKey).toString('hex')
  console.log(`RPC server listening. publicKey=${publicKeyHex}`)

  // Keep process alive.
  await new Promise(() => {})
}

await main()

