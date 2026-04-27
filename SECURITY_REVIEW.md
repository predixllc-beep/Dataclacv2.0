# Security Review & Architectures

## Core Principals
If the system trades real money, it must reside in a zero-trust execution environment.

1. **Vault / Secrets Engine**
   - API Keys must be injected at runtime using HashiCorp Vault or AWS Secrets Manager. No keys stored on disk `(.env` only for local dev).
2. **Signing Enclave**
   - Polymarket requires Polygon L2 signatures. The signing logic will reside in a protected, unexported function inside the execution layer.
3. **Network Isolation**
   - The backend runs entirely decoupled from the frontend.
4. **Rate Limit Defenses**
   - Token bucket algorithms inside the Connectors to ensure the exchange doesn't ban our APIs mid-arb.
5. **Circuit Breakers**
   - If fill rates drop below 10%, or PnL drops faster than 5% within 10 minutes, the global supervisor trips the circuit breaker and shuts down trading.
