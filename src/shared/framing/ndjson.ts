export type NdjsonDecoderOptions = {
    /** Max bytes allowed for a single NDJSON line (excluding the trailing '\n'). */
    maxFrameBytes: number
    /** If true, allow "\r\n" and trim a trailing "\r" from each line. Default: true */
    allowCRLF?: boolean
}
export type NdjsonDecodeErrorCode =
    | 'frame_too_large'
    | 'invalid_json'
    | 'invalid_utf8'
export class NdjsonDecodeError extends Error {
    readonly code: NdjsonDecodeErrorCode
    readonly cause?: unknown
    constructor(code: NdjsonDecodeErrorCode, message: string, cause?: unknown) {
        super(message)
        this.name = 'NdjsonDecodeError'
        this.code = code
        this.cause = cause
        Error.captureStackTrace(this, this.constructor)
    }
}
export interface NdjsonDecoder {
    /**
     * Push raw bytes into the decoder and receive zero or more decoded JSON values.
     * Must be safe for partial frames and multiple frames per chunk.
     */
    push(chunk: Uint8Array): unknown[]
    /**
     * Flush at end-of-stream.
     * Should error if there is trailing non-whitespace data without a newline.
     */
    finish(): void
    /** How many bytes are currently buffered waiting for a newline. */
    bufferedBytes(): number
    /** Reset internal buffer/state (useful in tests). */
    reset(): void
}

/** Create a streaming NDJSON decoder with size limits. */
export function createNdjsonDecoder(options: NdjsonDecoderOptions): NdjsonDecoder {
    const allowCRLF = options.allowCRLF ?? true
    const maxFrameBytes = options.maxFrameBytes

    // TextDecoder in streaming mode handles partial UTF-8 sequences across chunks.
    const decoder = new TextDecoder('utf-8', { fatal: true })
    let textBuffer = ''
    let bufferedBytesCount = 0

    const reset = () => {
        decoder.decode(new Uint8Array(0), { stream: false })
        textBuffer = ''
        bufferedBytesCount = 0
    }

    const pushText = (textChunk: string) => {
        textBuffer += textChunk

        const out: unknown[] = []
        while (true) {
            const nl = textBuffer.indexOf('\n')
            if (nl === -1) break

            let line = textBuffer.slice(0, nl)
            textBuffer = textBuffer.slice(nl + 1)

            // Frame size is defined as bytes excluding trailing '\n'.
            // We conservatively track buffered bytes by re-encoding each extracted line.
            // This is slightly more expensive but keeps the logic correct for UTF-8.
            bufferedBytesCount = new TextEncoder().encode(textBuffer).byteLength

            if (allowCRLF && line.endsWith('\r')) line = line.slice(0, -1)
            if (line.trim() === '') continue

            const lineBytes = new TextEncoder().encode(line).byteLength
            if (lineBytes > maxFrameBytes) {
                throw new NdjsonDecodeError(
                    'frame_too_large',
                    `NDJSON frame exceeded maxFrameBytes (${lineBytes} > ${maxFrameBytes})`
                )
            }

            try {
                out.push(JSON.parse(line))
            } catch (err) {
                throw new NdjsonDecodeError('invalid_json', 'Invalid JSON in NDJSON frame', err)
            }
        }

        // Enforce size limit on buffered (incomplete) frame too.
        if (bufferedBytesCount > maxFrameBytes) {
            throw new NdjsonDecodeError(
                'frame_too_large',
                `Buffered NDJSON frame exceeded maxFrameBytes (${bufferedBytesCount} > ${maxFrameBytes})`
            )
        }

        return out
    }

    return {
        push(chunk: Uint8Array): unknown[] {
            try {
                const decoded = decoder.decode(chunk, { stream: true })
                bufferedBytesCount += chunk.byteLength
                return pushText(decoded)
            } catch (err) {
                throw new NdjsonDecodeError('invalid_utf8', 'Invalid UTF-8 in NDJSON stream', err)
            }
        },
        finish(): void {
            let tail: string
            try {
                tail = decoder.decode(new Uint8Array(0), { stream: false })
            } catch (err) {
                throw new NdjsonDecodeError('invalid_utf8', 'Invalid UTF-8 in NDJSON stream', err)
            }

            if (tail) pushText(tail)

            if (textBuffer.trim() !== '') {
                throw new NdjsonDecodeError('invalid_json', 'Trailing data without newline at end-of-stream')
            }
        },
        bufferedBytes(): number {
            return bufferedBytesCount
        },
        reset(): void {
            reset()
        },
    }
}

/** Encode a JSON value as NDJSON bytes (single line + '\n'). */
export function encodeNdjson(value: unknown): Uint8Array {
    const line = `${JSON.stringify(value)}\n`
    return new TextEncoder().encode(line)
}