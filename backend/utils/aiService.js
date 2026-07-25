/**
 * AI Service
 * ----------
 * By default (USE_MOCK_AI=true, the setting used in this build) this module
 * returns realistic, deterministic mock results so the whole app works with
 * zero external API keys. If you later add an OPENAI_API_KEY and set
 * USE_MOCK_AI=false, swap the body of each function for a real call to the
 * OpenAI API (examples left as comments below).
 */

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for",
  "is", "are", "was", "were", "be", "been", "with", "as", "by", "at",
  "this", "that", "it", "its", "from", "we", "our", "their", "these",
  "those", "into", "using", "based", "study", "paper", "research",
]);

const extractKeywords = (text = "", limit = 8) => {
  const freq = {};
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
};

const summarizeText = async (text = "", title = "") => {
  if (process.env.USE_MOCK_AI !== "false") {
    const trimmed = text.trim();
    const sentences = trimmed.split(/(?<=[.?!])\s+/).filter(Boolean);
    const preview = sentences.slice(0, 3).join(" ");
    const keywords = extractKeywords(text, 5);

    return (
      `Summary${title ? ` of "${title}"` : ""}: ${
        preview || "No content was provided to summarize."
      } ` +
      (keywords.length
        ? `This work centers around ${keywords.join(", ")}.`
        : "")
    ).trim();
  }

  // Real OpenAI integration example:
  // const OpenAI = require("openai");
  // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const response = await client.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     { role: "system", content: "Summarize academic papers concisely." },
  //     { role: "user", content: text },
  //   ],
  // });
  // return response.choices[0].message.content;
};

const suggestTopics = async (interestArea = "") => {
  if (process.env.USE_MOCK_AI !== "false") {
    const base = interestArea || "your research area";
    return [
      `Emerging trends in ${base}: a systematic literature review`,
      `A comparative analysis of methodologies in ${base}`,
      `The impact of AI-assisted tools on ${base} research productivity`,
      `Ethical considerations and open challenges in ${base}`,
      `A meta-analysis of collaboration patterns in ${base} research`,
    ];
  }
  // Real OpenAI integration would go here.
};

const generateCitation = (paper = {}, style = "APA") => {
  const authors = paper.authors && paper.authors.length
    ? paper.authors.join(", ")
    : "Unknown Author";
  const year = paper.year || new Date(paper.createdAt || Date.now()).getFullYear();
  const title = paper.title || "Untitled";

  switch (style.toUpperCase()) {
    case "MLA":
      return `${authors}. "${title}." ${year}.`;
    case "CHICAGO":
      return `${authors}. ${year}. "${title}."`;
    case "APA":
    default:
      return `${authors} (${year}). ${title}.`;
  }
};

module.exports = {
  extractKeywords,
  summarizeText,
  suggestTopics,
  generateCitation,
};
