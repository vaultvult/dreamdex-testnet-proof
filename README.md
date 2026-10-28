# DreamDEX SDK Security Feedback

This repository contains reproducible reports for the DreamDEX Perps Builder Bounty (Feedback Track).

## 🚨 Findings Summary
1. **[Major] Silent Data Drop in listMarkets**: The SDK silently swallows InvariantError exceptions, returning incomplete market lists.
2. **[Normal] TypeError Crash in getMarketOnchain**: Hardcoded array indices without length validation cause raw JS crashes on malformed RPC responses.
3. **[Normal] Invalid GraphQL Query in getOpeningPrices**: The SDK stringifies null into "null" and sends it to the indexer as a valid question ID.

## 🛠️ Reproductions
To see the vulnerabilities in action, run the included scripts:

./run-all.sh

This will execute the scripts in the repros/ folder and save the terminal outputs to the evidence/ folder.

### Evidence
- [Bug 1 Output](./evidence/bug1_output.txt)
- [Bug 2 Output](./evidence/bug2_output.txt)
- [Bug 3 Output](./evidence/bug3_output.txt)

## 📄 Detailed Reports
Full write-ups with suggestions for the DreamDEX team are located in the feedback/ folder.
