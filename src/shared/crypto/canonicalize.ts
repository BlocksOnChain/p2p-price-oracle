type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }
export class CanonicalizeError extends Error { }
function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (value === null || typeof value !== 'object') return false
    const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}
function normalize(value: unknown): JsonValue {
    if (value === null) return null
    const t = typeof value
    if (typeof value === 'string' || typeof value === 'boolean') return value
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) throw new CanonicalizeError('Non-finite number not allowed')
        // Note: -0 stringifies to "0" in JSON; that’s OK as long as you accept it.
        return value
    }
    if (typeof value === 'bigint') {
        // JSON can’t represent bigint; sign as string if you need integers.
        throw new CanonicalizeError('bigint not allowed (convert to string)')
    }
    if (t === 'undefined' || t === 'function' || t === 'symbol') {
        throw new CanonicalizeError(`Unsupported type: ${t}`)
    }
    if (Array.isArray(value)) {
        return value.map(normalize)
    }
    if (!isPlainObject(value)) {
        // Disallow Date, Buffer, Map, Set, class instances, etc. Convert them before signing.
        throw new CanonicalizeError('Only plain objects are allowed')
    }
    const keys = Object.keys(value).sort()
    const out: Record<string, JsonValue> = {}
    for (const k of keys) {
        const v = (value as Record<string, unknown>)[k]
        if (v === undefined) {
            // Important: JSON.stringify drops undefined anyway; throwing makes this explicit.
            throw new CanonicalizeError(`Undefined not allowed at key: ${k}`)
        }
        out[k] = normalize(v)
    }
    return out
}
export function canonicalize(value: unknown): Uint8Array {
    const normalized = normalize(value)
    const json = JSON.stringify(normalized) // stable because keys were sorted in normalize()
    return new TextEncoder().encode(json)
}