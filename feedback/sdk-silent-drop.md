# SDK silently drops malformed markets in `listMarkets`, causing incomplete data returns and pagination desync

Severity: major
Area: SDK

## Steps to reproduce
1. Initialize the `@somnia-chain/markets-sdk` client.
2. Call `client.listMarkets({ limit: 50 })`.
3. The indexer returns a page of 50 rows, but one row is missing a required field (e.g., `baseToken` is null for a SPOT market).
4. Observe that the SDK returns an array of 49 markets.

## Expected
The SDK should throw an error (like `resolveMarkets` does with `IndexerError`) or at least expose the dropped count to the caller without requiring a completely different function call.

## Actual
The `toMarkets` function catches `InvariantError` and silently drops the malformed row. The `listMarkets` function uses `toMarkets`, so the caller receives an incomplete list of 49 markets. The pagination logic will now fetch the next page using offset `50`, completely skipping the dropped market.

## Evidence
File: `src/markets.ts`
```typescript
export function toMarkets(rows: readonly RawMarketRow[]): Market[] {
  const out: Market[] = [];
  for (const r of rows) {
    try {
      out.push(toMarket(r));
    } catch (e) {
      if (!(e instanceof InvariantError)) throw e;
    }
  }
  return out;
}
