## P2P Price Oracle (HyperSwarm + DHT + RPC)

This repo is **documentation-only**: a step-by-step guide plus high-level and deep system design for a decentralized crypto price aggregation/oracle-like service built on **Hyperswarm DHT discovery** and **HyperSwarm RPC over duplex streams**.

## TypeScript + Node.js project layout

The project now includes a minimal TypeScript Node layout (still no real implementation):

- `src/peer/main.ts`: peer node entrypoint (placeholder)
- `src/client/main.ts`: client entrypoint (placeholder)
- `tsconfig.json`, `eslint.config.mjs`, `.prettierrc.json`

### Install

Run in `C:\Users\pc\p2p-price-oracle`:

```bash
npm install
```

### Run (placeholders for now)

```bash
npm run dev:peer
npm run dev:client
```

## What you’re building (v1)

- **Aggregator nodes (peers)**: fetch prices from centralized exchanges (CEXes), normalize, cache, sign responses, optionally gossip summaries.
- **Clients**: discover peers via DHT topics, query multiple peers in parallel (pull), optionally subscribe to updates (push), then aggregate using quorum/median/outlier filtering.
- **Networking**: Hyperswarm DHT for discovery + Hyperswarm sockets for transport + an RPC protocol on top.

## Documents

Start here:

- `docs/00-start-here.md`: step-by-step build plan and milestones
- `docs/01-system-design-high-level.md`: interview-style HLD (components + flows)
- `docs/02-system-design-deep.md`: DLD (protocols, data model, trust, reputation, scaling)
- `docs/03-rpc-protocol.md`: request/response + subscribe message contract
- `docs/04-threat-model.md`: attacks + mitigations (oracle-oriented)
- `docs/05-testing-plan.md`: how to validate correctness and robustness
- `docs/06-operability.md`: metrics/logging, peer debugging, rollouts, versioning
- `docs/07-tickets.md`: implementer-ready tickets/backlog
- `docs/linear-import-coin-price-agg.csv`: CSV import for Linear project `coin-price-agg`
- `docs/linear-import-instructions.md`: how to import into Linear

## Quick mental model

1) **Discover** peers via DHT topic(s)  
2) **Connect** via Hyperswarm (duplex stream)  
3) **RPC**: request price or subscribe to a stream  
4) **Verify** signatures + freshness  
5) **Aggregate** multiple peer responses into a final price  

## Notes about Cursor workspace

On Windows, the built-in “move workspace root” automation can fail depending on environment. All docs are written under `C:\Users\pc\p2p-price-oracle` regardless.

