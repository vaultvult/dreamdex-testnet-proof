import express from "express";
import cors from "cors";
import path from "path";
import { startBot, currentRates } from "./funding-alert-bot";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API endpoint for the GUI to fetch rates
app.get("/api/rates", (req, res) => {
    res.json(currentRates);
});

// Serve the frontend HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the bot engine and the web server
startBot();
app.listen(PORT, () => {
    console.log(`\n🌐 GUI is live at http://localhost:${PORT}`);
});
