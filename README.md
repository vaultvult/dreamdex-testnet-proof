# DreamDEX Builder Bounty: SDK Feedback & MVP Alert Bot

This repository contains my submissions for the DreamDEX Perps Builder Bounty. It includes a comprehensive security/feedback report on the SDK, and a functional MVP (Minimum Viable Product) bot built to monitor market conditions.

## 🏆 1. MVP Track: Funding Rate Alert Bot

### Overview
A lightweight, Node.js-based alert bot for the DreamDEX SDK. It continuously monitors the Somnia Testnet using `listPerpMarkets()` and detects when a market's funding rate flips (from positive to negative, or vice versa). When a flip is detected, it pushes an automated alert to a Discord webhook.

### Features
*   **Real-time Monitoring:** Polls the Hideki Testnet Indexer every 60 seconds.
*   **State Tracking:** Saves previous funding rates in memory to detect exact flip moments.
*   **Discord Integration:** Sends formatted alerts directly to a Discord channel.
*   **Security First:** Uses `dotenv` to protect webhook URLs from being exposed in the public repository.

### How to Run Locally
1. Clone the repository and install dependencies:
   ```bash
   npm install
