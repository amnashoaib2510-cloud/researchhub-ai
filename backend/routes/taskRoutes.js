const express = require("express");
const {
  createTask,
  getTasksByProject,
  getMyTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/my-tasks", protect, getMyTasks);
router.get("/project/:projectId", protect, getTasksByProject);
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
