# DreamDEX Testnet Connection Proof

This repository contains a TypeScript script that connects to the Somnia Hideki Testnet using the official `@somnia-chain/markets-sdk`.

## What it does
- Initializes the `SomniaMarkets` client using the Hideki testnet configuration.
- Fetches the list of available perpetual markets.
- Extracts and logs the details (Pool Address, Margin Bank, Decimals) for the BTC perp market.

## How to run
1. Install dependencies: `npm install`
2. Run the script: `npx tsx connect.ts`
