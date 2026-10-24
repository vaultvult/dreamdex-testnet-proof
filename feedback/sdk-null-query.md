# `getOpeningPrices` queries `OracleAnswer` with "null" strings for missing reference question IDs

Severity: normal
Area: SDK

## Steps to reproduce
1. Call `client.getOpeningPrices(marketIds)`.
2. The indexer returns a `MarketReferenceLink` row where `referenceQuestionId` is null.
3. Observe the `OracleAnswersByQidQuery` being sent to the indexer with `qids: ["null"]`.

## Expected
The SDK should skip reference links that do not have a valid `referenceQuestionId` and not send invalid queries to the indexer.

## Actual
The SDK stringifies `null` into `"null"` and includes it in the `qids` query. This results in a wasted network request and could lead to unexpected results if the indexer happens to have an answer for `"null"`.

## Evidence
File: `src/markets.ts`
```typescript
for (const l of links.MarketReferenceLink) {
  marketToQid.set(l.market.toLowerCase(), String(l.referenceQuestionId));
  qids.add(String(l.referenceQuestionId));
}
