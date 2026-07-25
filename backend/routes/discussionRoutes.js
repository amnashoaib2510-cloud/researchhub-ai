const express = require("express");
const { postMessage, getMessages } = require("../controllers/discussionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, postMessage);
router.get("/:projectId", protect, getMessages);

module.exports = router;
