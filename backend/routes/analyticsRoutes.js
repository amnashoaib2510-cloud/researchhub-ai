const express = require("express");
const {
  getDashboardAnalytics,
  getProductivityReport,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", protect, getDashboardAnalytics);
router.get("/productivity", protect, getProductivityReport);

module.exports = router;
