// Simulates the internal `toMarkets` function in the SDK
// File: src/markets.ts line ~520
function toMarkets(rows: any[]): any[] {
    const out: any[] = [];
    for (const r of rows) {
        try {
            // Simulating toMarket(r) throwing an InvariantError
            if (!r.baseToken) throw new Error("InvariantError: SPOT row missing baseToken");
            out.push(r);
        } catch (e) {
            // SDK silently swallows the error
            if (!(e instanceof Error && e.message.includes("InvariantError"))) throw e;
        }
    }
    return out;
}

console.log("--- Bug 1: Silent Data Drop ---");
const mockRows = [
    { id: "market_1", baseToken: "0x1" },
    { id: "market_2", baseToken: null }, // Malformed row
    { id: "market_3", baseToken: "0x3" }
];

const result = toMarkets(mockRows);
console.log(`Indexer returned: ${mockRows.length} rows`);
console.log(`SDK returned:     ${result.length} rows`);
if (result.length !== mockRows.length) {
    console.log("🚨 VULNERABILITY CONFIRMED: SDK silently dropped a malformed market row.");
}
