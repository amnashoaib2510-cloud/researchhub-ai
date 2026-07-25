const express = require("express");
const { updateProfile, getUsers, getAllUsersAdmin } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

const router = express.Router();

router.get("/", protect, getUsers);
router.put("/profile", protect, updateProfile);
router.get("/admin/all", protect, authorize("Admin"), getAllUsersAdmin);

module.exports = router;
