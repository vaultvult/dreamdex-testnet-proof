import { SomniaMarkets, SOMNIA_HIDEKI_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";

async function main() {
    console.log("Connecting to Somnia Hideki Testnet...");

    const markets = new SomniaMarkets({
        chain: hidekiTestnet,
        indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql",
        addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
    });

    try {
        console.log("Fetching perp markets...");
        const perps = await markets.client.listPerpMarkets();
        
        console.log(`✅ Successfully connected! Found ${perps.length} markets.`);
        
        const btc = perps.find((m: any) => m.baseSymbol === "BTC");
        
        if (btc) {
            console.log("\n--- BTC Perp Market Details ---");
            console.log(`Base Symbol: ${btc.baseSymbol}`);
            console.log(`Pool Address: ${btc.poolAddress}`);
            console.log(`Margin Bank: ${btc.marginBank}`);
            console.log(`Base Decimals: ${btc.baseDecimals}`);
            console.log(`Quote Decimals: ${btc.quoteDecimals}`);
        } else {
            console.log("Could not find a BTC market.");
        }

    } catch (error) {
        console.error("❌ Error connecting to the API:", error);
    }
}

main().catch(console.error);
