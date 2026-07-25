const Message = require("../models/Message");

// @desc Post a message in a project's discussion panel
// @route POST /api/discussions
// @access Private
const postMessage = async (req, res, next) => {
  try {
    const { project, content } = req.body;
    if (!content) return res.status(400).json({ message: "Message content is required" });

    const message = await Message.create({
      project,
      sender: req.user._id,
      content,
    });

    const populated = await message.populate("sender", "name role avatar");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc Get all messages for a project
// @route GET /api/discussions/:projectId
// @access Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ project: req.params.projectId })
      .populate("sender", "name role avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = { postMessage, getMessages };
