const express = require("express");
const { summarize, topicSuggestions, citation, keywords } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/summarize", protect, summarize);
router.post("/suggest-topics", protect, topicSuggestions);
router.post("/citation", protect, citation);
router.post("/keywords", protect, keywords);

module.exports = router;
