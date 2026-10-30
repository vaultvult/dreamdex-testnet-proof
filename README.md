# DreamDEX Builder Bounty: SDK Feedback & MVP Alert Bot

This repository contains my submissions for the DreamDEX Perps Builder Bounty. It includes a comprehensive security/feedback report on the SDK, and a functional MVP (Minimum Viable Product) Web Dashboard and Alert Bot built to monitor market conditions.

## 🏆 1. MVP Track: Funding Rate Alert Bot & Web Dashboard

### Overview
A lightweight, automated alert bot and Web Dashboard for the DreamDEX SDK. It continuously monitors the Somnia Testnet using `listPerpMarkets()` and detects when a market's funding rate flips (from positive to negative, or vice versa). When a flip is detected, it pushes an automated alert to a Discord webhook.

### Features
*   **Live Web Dashboard:** An Express.js-powered frontend that visualizes real-time funding rates in a dark-mode grid layout.
*   **Decoupled Architecture:** A background TypeScript engine handles the SDK polling and Discord alerts, entirely separated from the frontend.
*   **Real-time Monitoring:** Polls the Hideki Testnet Indexer every 60 seconds.
*   **Security First:** Uses `dotenv` to protect webhook URLs from being exposed in the public repository.

### How to Run Locally
1. Clone the repository and install dependencies:
   ```bash
   npm install
