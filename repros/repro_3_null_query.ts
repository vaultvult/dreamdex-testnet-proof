// Simulates the `getOpeningPrices` function in the SDK
// File: src/markets.ts line ~1120
console.log("--- Bug 3: Invalid GraphQL Null Query ---");

const links = [
    { market: "0xabc", referenceQuestionId: "123" },
    { market: "0xdef", referenceQuestionId: null } // Null reference link
];

const qids = new Set<string>();
for (const l of links) {
    qids.add(String(l.referenceQuestionId));
}

const queryArray = [...qids];
console.log(`Sending qids: ${JSON.stringify(queryArray)}`);

if (queryArray.includes("null")) {
    console.log("🚨 VULNERABILITY CONFIRMED: SDK stringifies null and sends it as a GraphQL query parameter.");
}
