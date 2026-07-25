const Project = require("../models/Project");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc Create a new research project
// @route POST /api/projects
// @access Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, category, deadline, tags } = req.body;

    const project = await Project.create({
      title,
      description,
      category,
      deadline,
      tags,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "Lead" }],
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc Get all projects visible to the current user
// @route GET /api/projects
// @access Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    })
      .populate("owner", "name email role")
      .populate("members.user", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc Get single project by id
// @route GET /api/projects/:id
// @access Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email role")
      .populate("members.user", "name email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc Update project details / progress / status
// @route PUT /api/projects/:id
// @access Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only the project owner can update this project" });
    }

    const fields = ["title", "description", "category", "status", "progress", "deadline", "tags"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a project
// @route DELETE /api/projects/:id
// @access Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only the project owner can delete this project" });
    }

    await project.deleteOne();
    res.json({ message: "Project removed" });
  } catch (error) {
    next(error);
  }
};

// @desc Invite / add a team member to a project
// @route POST /api/projects/:id/invite
// @access Private
const inviteMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const invitedUser = await User.findOne({ email });
    if (!invitedUser) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === invitedUser._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member of this project" });
    }

    project.members.push({ user: invitedUser._id, role: role || "Collaborator" });
    await project.save();

    await Notification.create({
      recipient: invitedUser._id,
      type: "PROJECT_INVITATION",
      title: "New project invitation",
      message: `You have been invited to join "${project.title}" as ${role || "Collaborator"}.`,
      relatedProject: project._id,
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc Remove a member from a project
// @route DELETE /api/projects/:id/members/:userId
// @access Private
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only the project owner can remove members" });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
};
