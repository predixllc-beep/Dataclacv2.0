# Dependency Minimization Protocol

## Core Directive
Polyclaw aims to minimize all requirements in `requirements.txt`. Every added package introduces CVE risks, deprecation risks, and performance overhead.

## Allowed Dependencies
- `web3`: Strictly required for Polygon L2 EVM signatures for Polymarket.
- `websockets`: Strongly typed and efficient WS handling.
- `requests`: Standard REST interactions.
- `prometheus-client`: For exporting metrics natively.

## Banned Dependencies
- `ccxt`: We implemented our own `ExchangeBase`. CCXT is too heavy and primarily crypto-focused.
- `hummingbot` (as runtime): We implemented native OMS/EMS.
- `pandas` / `numpy` (in critical path): While useful for backtesting, the live risk and execution engines use raw Python structures for sub-millisecond processing unless massive matrix math is needed.

## Result
By maintaining a slim dependency tree, the Docker image builds in seconds, memory footprint is under 100MB, and vulnerability surface is negligible.
