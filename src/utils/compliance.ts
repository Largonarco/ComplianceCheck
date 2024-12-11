import { JSDOM } from "jsdom";
import type OpenAI from "openai";

// Checks compliance
const checkCompliance = async (
  openai: OpenAI,
  content: string,
  policy: string
): Promise<string[]> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      {
        role: "user",
        content: `Check the following content against the compliance policy and only return non-compliant findings as bullet points in detail:\n\nPolicy:\n${policy}\n\nContent:\n${content}`,
      },
    ],
  });

  return (
    response.choices[0]?.message?.content?.split("\n").filter((line) => line.trim() !== "") || []
  );
};

// Extracts only relevant text
const extractRelevantText = (html: string): string => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Extract text from only <p>, <h1>, <h2>, <h3>, <h4>, and <li> tags
  const relevantText = Array.from(document.querySelectorAll("p, h1, h2, h3, h4, span, li"))
    .map((element) => element.textContent)
    .join("\n")
    .trim();

  return relevantText;
};

export { checkCompliance, extractRelevantText };
