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
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: `Identify any non-compliant findings within the webpage content that do not align with the policy. If there are no non-compliant findings, explicitly state that the webpage content is fully compliant with the policy. If non-compliant findings are identified, present them in a straightforward, structured format as bullet points. Each bullet point should highlight a distinct non-compliant finding, and no two bullet points should emphasize the same issue. 
Ensure that your analysis is accurate; do not imply non-compliance if there is none.
Instructions:
Review the webpage content and the policy content.
Compare the webpage content against the policy to identify any non-compliant elements.
If non-compliance is found, list the findings as bullet points, ensuring each bullet point addresses a unique issue.
If no non-compliance is found, clearly state that the webpage content is fully compliant with the policy.

Output Format:
If non-compliant findings are present:
[Description of the first non-compliant finding]
[Description of the second non-compliant finding]
...

If no non-compliant findings are present:
"Found nothing"

Policy:
${policy}

Content:
${content}

Note: Ensure that the analysis is precise, accurate, and does not include any hallucinated findings.
`,
      },
    ],
  });

  // Extract non-empty lines from the response and returns findings
  return response.choices[0]?.message?.content === "Found nothing"
    ? []
    : response.choices[0]?.message?.content?.split("\n").filter((line) => line.trim() !== "") || [];
};

// Extracts only relevant text
const extractRelevantText = (html: string): string => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Extract text from only <p>, <h1>, <h2>, <h3>, <h4>, and <li> tags
  // This is done to reduce the content size significantly and to remove unnecessary content.
  // Although this does imply that if the website doesn't make proper use of these tags, content will be missed.
  const relevantText = Array.from(document.querySelectorAll("p, h1, h2, h3, h4, li"))
    .map((element) => element.textContent)
    .join("\n")
    .trim();

  return relevantText;
};

export { checkCompliance, extractRelevantText };
