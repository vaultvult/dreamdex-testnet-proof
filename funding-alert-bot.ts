import { SomniaMarkets, SOMNIA_HIDEKI_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// We export this so the web server can read it
export const currentRates: Record<string, number> = {};
const lastFundingRates = new Map<string, number>();

export async function checkFundingRates() {
    if (!DISCORD_WEBHOOK_URL) {
        console.error("❌ Error: DISCORD_WEBHOOK_URL is missing.");
        return;
    }

    const markets = new SomniaMarkets({
        chain: hidekiTestnet,
        indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql",
        addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
    });

    try {
        const perps = await markets.client.listPerpMarkets();
        
        for (const market of perps) {
            const rawRate = Number(market.fundingRate || market.currentFundingRate || 0);
            const currentRate = rawRate / 1e18;
            const prevRate = lastFundingRates.get(market.poolAddress);

            // Save to the exported object for the GUI to read
            currentRates[market.baseSymbol] = currentRate;

            if (prevRate !== undefined && ((prevRate > 0 && currentRate < 0) || (prevRate < 0 && currentRate > 0))) {
                console.log(`🚨 Funding flip detected for ${market.baseSymbol}!`);
                await sendDiscordAlert(market.baseSymbol, prevRate, currentRate);
            }
            lastFundingRates.set(market.poolAddress, currentRate);
        }
    } catch (error) {
        console.error("❌ Error fetching funding rates:", error);
    }
}

async function sendDiscordAlert(symbol: string, oldRate: number, newRate: number) {
    if (!DISCORD_WEBHOOK_URL) return;
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

// Start the background loop
export function startBot() {
    console.log("🚀 Starting background engine...");
    checkFundingRates();
    setInterval(checkFundingRates, 60000);
}
