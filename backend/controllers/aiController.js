const { summarizeText, suggestTopics, generateCitation, extractKeywords } = require("../utils/aiService");
const Paper = require("../models/Paper");

// @desc Summarize arbitrary text or an existing paper
// @route POST /api/ai/summarize
// @access Private
const summarize = async (req, res, next) => {
  try {
    const { text, paperId } = req.body;

    let sourceText = text;
    let title = "";

    if (paperId) {
      const paper = await Paper.findById(paperId);
      if (!paper) return res.status(404).json({ message: "Paper not found" });
      sourceText = paper.abstract || paper.title;
      title = paper.title;
    }

    if (!sourceText) {
      return res.status(400).json({ message: "Please provide text or a paperId to summarize" });
    }

    const summary = await summarizeText(sourceText, title);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

// @desc Suggest research topics based on an interest area
// @route POST /api/ai/suggest-topics
// @access Private
const topicSuggestions = async (req, res, next) => {
  try {
    const { interestArea } = req.body;
    const topics = await suggestTopics(interestArea);
    res.json({ topics });
  } catch (error) {
    next(error);
  }
};

// @desc Generate a formatted citation for a paper
// @route POST /api/ai/citation
// @access Private
const citation = async (req, res, next) => {
  try {
    const { paperId, style } = req.body;
    const paper = await Paper.findById(paperId);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const result = generateCitation(paper, style || "APA");
    res.json({ citation: result, style: style || "APA" });
  } catch (error) {
    next(error);
  }
};

// @desc Extract keywords from text
// @route POST /api/ai/keywords
// @access Private
const keywords = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Please provide text" });

    const result = extractKeywords(text);
    res.json({ keywords: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { summarize, topicSuggestions, citation, keywords };
