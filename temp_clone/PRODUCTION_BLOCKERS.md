# Production Blockers

These MUST be resolved before any live capital is deployed:

1. **Polygon L2 Gas Management**
   - Need an automated gas escalator service. If Polygon spikes, our transaction sits pending and we eat terrible execution risk.
2. **Missing Reconciliation Service**
   - We need an end-of-day task that extracts all fill receipts from the exchanges and matches them against our local DB to ensure 0 slippage anomalies.
3. **Security Keys in Plaintext**
   - Currently, `.env` holds everything. In prod, we must fetch from AWS Secrets Manager using IAM roles.
4. **Kill Switch Activation Path**
   - The kill switch must be testable via a REST endpoint or physical button on an admin dashboard. Currently, it's just code logic.
