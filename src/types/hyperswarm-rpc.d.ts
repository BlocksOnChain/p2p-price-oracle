declare module '@hyperswarm/rpc' {
    import { EventEmitter } from 'node:events'

    export type PublicKey = Uint8Array

    export interface KeyPair {
        publicKey: Uint8Array
        secretKey: Uint8Array
    }

    export interface DestroyOptions {
        force?: boolean
    }

    export interface HyperswarmRPCOptions {
        valueEncoding?: unknown
        seed?: Uint8Array
        keyPair?: KeyPair
        bootstrap?: unknown
        debug?: unknown
        dht?: unknown
        namespace?: unknown
        capability?: unknown
        poolLinger?: number
    }

    export interface ConnectOptions {
        capability?: unknown
        [key: string]: unknown
    }

    export interface RequestOptions {
        [key: string]: unknown
    }

    export type RpcHandler<Request = unknown, Response = unknown> = (request: Request, rpc: unknown) => Response | Promise<Response>

    export interface ServerOptions {
        capability?: unknown
        [key: string]: unknown
    }

    export class Client extends EventEmitter {
        request(method: string, value: unknown, options?: RequestOptions): Promise<unknown>
        event(method: string, value: unknown, options?: RequestOptions): void
        end(): Promise<void>
        destroy(err?: unknown): void

        readonly dht: unknown
        readonly rpc: unknown
        readonly closed: boolean
        readonly mux: unknown
        readonly stream: unknown
    }

    export class Server extends EventEmitter {
        listen(keyPair?: KeyPair): Promise<void>
        close(): Promise<void>

        respond<Request = unknown, Response = unknown>(method: string, handler: RpcHandler<Request, Response>): this
        respond<Request = unknown, Response = unknown>(
            method: string,
            options: unknown,
            handler: RpcHandler<Request, Response>
        ): this
        unrespond(method: string): this

        address(): unknown

        readonly dht: unknown
        readonly closed: boolean
        readonly publicKey: PublicKey
        readonly connections: Set<unknown>
    }

    export default class HyperswarmRPC {
        constructor(options?: HyperswarmRPCOptions)

        readonly dht: unknown
        readonly defaultKeyPair: KeyPair

        createServer(options?: ServerOptions): Server
        connect(publicKey: PublicKey, options?: ConnectOptions): Client

        request(publicKey: PublicKey, method: string, value: unknown, options?: RequestOptions): Promise<unknown>
        event(publicKey: PublicKey, method: string, value: unknown, options?: RequestOptions): void

        destroy(options?: DestroyOptions): Promise<void>
    }
}

