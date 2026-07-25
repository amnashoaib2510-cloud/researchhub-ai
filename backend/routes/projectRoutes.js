const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createProject).get(protect, getProjects);
router
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);
router.post("/:id/invite", protect, inviteMember);
router.delete("/:id/members/:userId", protect, removeMember);

module.exports = router;
