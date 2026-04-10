declare module 'compact-encoding' {
    export interface Encoding<T> {
        preencode(state: unknown, value: T): void
        encode(state: unknown, value: T): void
        decode(state: unknown): T
    }

    export const string: Encoding<string>

    const _default: {
        string: Encoding<string>
        // other encodings exist, but we only type what we use
    }

    export default _default
}

