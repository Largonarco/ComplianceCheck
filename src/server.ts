import dotenv from "dotenv";
import { OpenAI } from "openai";
import express, { Request, Response } from "express";

import { extractRelevantText, checkCompliance } from "./utils/compliance";

dotenv.config();

const server = express();

// JSON Parser Middleware
server.use(express.json());

// OpenAI Node Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST API
// ROUTE --> /check-compliance
// Requires WebpageURL and PolicyURL
server.post("/check-compliance", async (req: Request, res: Response): Promise<void> => {
  const { webpageUrl, policyUrl }: { webpageUrl: string; policyUrl: string } = req.body;

  if (!webpageUrl || !policyUrl) {
    res.status(400).json({ error: "Mandatory fields missing" });
  }

  try {
    // Fetching compliance policy
    const policyResponse = await fetch(policyUrl);
    const policyContent = await policyResponse.text();
    const relevantPolicyContent = extractRelevantText(policyContent);

    // Fetching webpage content
    const webpageResponse = await fetch(webpageUrl);
    const webpageContent = await webpageResponse.text();
    const relevantWebpageContent = extractRelevantText(webpageContent);

    // Deriving findings
    const findings = await checkCompliance(openai, relevantWebpageContent, relevantPolicyContent);

    res.json({ findings });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while checking compliance." });
  }
});

// Server Running
server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
