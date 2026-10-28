// Simulates the `getMarketOnchain` function in the SDK
// File: src/markets.ts line ~950
function simulateGetMarketOnchain(contractResponse: any[]) {
    // SDK accesses hardcoded indices without validating array length
    const marketAddress = contractResponse[8]; 
    
    // This regex test will throw a TypeError if marketAddress is undefined
    if (/^0x0{40}$/.test(marketAddress)) {
        console.log("Unknown marketId");
    }
}

console.log("--- Bug 2: TypeError Crash ---");
const malformedResponse: any[] = []; // Simulating an ABI mismatch or empty return
try {
    simulateGetMarketOnchain(malformedResponse);
} catch (e: any) {
    console.log(`🚨 VULNERABILITY CONFIRMED: SDK crashed with ${e.name}`);
    console.log(`Message: ${e.message}`);
}
