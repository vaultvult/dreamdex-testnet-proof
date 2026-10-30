import { SomniaMarkets, SOMNIA_HIDEKI_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
import axios from "axios";

// 🔴 REPLACE THIS with your Discord Webhook URL
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1565686426798923966/1EjTvYBveCzEfQakKxr4ViirX2R6_08R6479s8eDCxhCfTvUAHDexdILP3EPbT2D754x";

// Store the last known funding rates to detect flips
const lastFundingRates = new Map<string, number>();

async function checkFundingRates() {
    const markets = new SomniaMarkets({
        chain: hidekiTestnet,
        indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql",
        addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
    });

    try {
        const perps = await markets.client.listPerpMarkets();
        
        for (const market of perps) {
            // Check if the market has a funding rate property
            // (If your SDK uses a different property name like 'currentFundingRate', adjust this)
            const currentRate = Number(market.fundingRate || market.currentFundingRate || 0);
            const prevRate = lastFundingRates.get(market.poolAddress);

            if (prevRate !== undefined) {
                // Detect a flip (Positive to Negative, or Negative to Positive)
                if ((prevRate > 0 && currentRate < 0) || (prevRate < 0 && currentRate > 0)) {
                    console.log(`🚨 Funding flip detected for ${market.baseSymbol}!`);
                    await sendDiscordAlert(market.baseSymbol, prevRate, currentRate);
                }
            }

            // Update the stored rate for the next loop
            lastFundingRates.set(market.poolAddress, currentRate);
        }
    } catch (error) {
        console.error("❌ Error fetching funding rates:", error);
    }
}

async function sendDiscordAlert(symbol: string, oldRate: number, newRate: number) {
    if (DISCORD_WEBHOOK_URL === "https://discord.com/api/webhooks/1565686426798923966/1EjTvYBveCzEfQakKxr4ViirX2R6_08R6479s8eDCxhCfTvUAHDexdILP3EPbT2D754x") {
        console.log("⚠️ No Discord Webhook URL provided. Skipping alert.");
        return;
    }

    const payload = {
        content: `🚨 **Funding Rate Flip Detected** 🚨\n**Market:** ${symbol}\n**Previous Rate:** ${oldRate}\n**New Rate:** ${newRate}`
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL, payload);
        console.log("✅ Discord alert sent!");
    } catch (error) {
        console.error("❌ Failed to send Discord alert:", error);
    }
}

// Run the check every 60 seconds
console.log("🚀 Starting DreamDEX Funding Rate Monitor...");
checkFundingRates(); // Initial run
setInterval(checkFundingRates, 60000);
