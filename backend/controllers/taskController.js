const Task = require("../models/Task");
const Notification = require("../models/Notification");

// @desc Create a task within a project
// @route POST /api/tasks
// @access Private
const createTask = async (req, res, next) => {
  try {
    const { project, title, description, assignedTo, priority, dueDate } = req.body;

    const task = await Task.create({
      project,
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      dueDate,
    });

    if (assignedTo) {
      await Notification.create({
        recipient: assignedTo,
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: `${req.user.name} assigned you a task: "${title}".`,
        relatedProject: project,
      });
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc Get tasks for a project
// @route GET /api/tasks/project/:projectId
// @access Private
const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc Get tasks assigned to the current user
// @route GET /api/tasks/my-tasks
// @access Private
const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("project", "title")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc Update task status/details
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const fields = ["title", "description", "status", "priority", "dueDate", "assignedTo"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasksByProject, getMyTasks, updateTask, deleteTask };
