# `getMarketOnchain` crashes with `TypeError` if the contract returns a malformed array

Severity: normal
Area: SDK

## Steps to reproduce
1. Call `client.getMarketOnchain(marketId)`.
2. Mock the underlying `client.readContract` call to return an empty array `[]` or an array with fewer than 9 elements (simulating an ABI mismatch or contract upgrade).
3. Observe the SDK throwing `TypeError: Cannot read properties of undefined (reading 'toString')`.

## Expected
The SDK should validate that the returned array has the expected length (at least 14 elements based on the current indices) and throw a descriptive `InvalidInputError` if it does not.

## Actual
The SDK accesses hardcoded indices like `rec[8]` and `rec[9]` without validating the array length. It then passes `undefined` to a regex test (`/^0x0{40}$/.test(marketAddress)`), which throws a raw JavaScript `TypeError`, crashing the application.

## Evidence
File: `src/markets.ts`
```typescript
const rec = await pc.readContract({
  address: sources.module,
  abi: ModuleAbi.binaryModuleReadAbi,
  functionName: "markets",
  args: [marketId],
});
const marketAddress = rec[8];
if (/^0x0{40}$/.test(marketAddress)) {
  throw new InvalidInputError(`unknown marketId ${marketId} on the module`);
}
