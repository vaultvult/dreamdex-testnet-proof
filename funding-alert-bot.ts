import { SomniaMarkets, SOMNIA_HIDEKI_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
import axios from "axios";
import * as dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Securely get the Webhook URL
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Store the last known funding rates to detect flips
const lastFundingRates = new Map<string, number>();

async function checkFundingRates() {
    if (!DISCORD_WEBHOOK_URL) {
        console.error("❌ Error: DISCORD_WEBHOOK_URL is not set in the .env file!");
        process.exit(1);
    }

    const markets = new SomniaMarkets({
        chain: hidekiTestnet,
        indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql",
        addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
    });

    try {
        const perps = await markets.client.listPerpMarkets();
        
        for (const market of perps) {
            const currentRate = Number(market.fundingRate || market.currentFundingRate || 0);
            const prevRate = lastFundingRates.get(market.poolAddress);

            if (prevRate !== undefined) {
                if ((prevRate > 0 && currentRate < 0) || (prevRate < 0 && currentRate > 0)) {
                    console.log(`🚨 Funding flip detected for ${market.baseSymbol}!`);
                    await sendDiscordAlert(market.baseSymbol, prevRate, currentRate);
                }
            }

            lastFundingRates.set(market.poolAddress, currentRate);
        }
    } catch (error) {
        console.error("❌ Error fetching funding rates:", error);
    }
}

async function sendDiscordAlert(symbol: string, oldRate: number, newRate: number) {
    const payload = {
        content: `🚨 **Funding Rate Flip Detected** 🚨\n**Market:** ${symbol}\n**Previous Rate:** ${oldRate}\n**New Rate:** ${newRate}`
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL!, payload);
        console.log("✅ Discord alert sent!");
    } catch (error) {
        console.error("❌ Failed to send Discord alert:", error);
    }
}

console.log("🚀 Starting DreamDEX Funding Rate Monitor...");
checkFundingRates();
setInterval(checkFundingRates, 60000);
