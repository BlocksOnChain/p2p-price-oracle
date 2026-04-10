export function parseHexPublicKey(hex: string): Uint8Array {
    const normalized = hex.trim().toLowerCase()
    if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
        throw new Error('Expected a hex public key (even-length, 0-9a-f).')
    }
    return Buffer.from(normalized, 'hex')
}