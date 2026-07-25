const express = require("express");
const {
  uploadPaper,
  getPapers,
  getPaperById,
  addPaperVersion,
  deletePaper,
  summarizePaper,
} = require("../controllers/paperController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.route("/").post(protect, upload.single("file"), uploadPaper).get(protect, getPapers);
router.route("/:id").get(protect, getPaperById).delete(protect, deletePaper);
router.post("/:id/versions", protect, upload.single("file"), addPaperVersion);
router.post("/:id/summarize", protect, summarizePaper);

module.exports = router;
