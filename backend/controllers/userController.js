const User = require("../models/User");

// @desc Update own profile
// @route PUT /api/users/profile
// @access Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.institution = req.body.institution ?? user.institution;
    user.bio = req.body.bio ?? user.bio;
    user.avatar = req.body.avatar ?? user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      institution: updatedUser.institution,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all users (for inviting to projects)
// @route GET /api/users
// @access Private
const getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : {};
    const users = await User.find(filter).select("name email role institution avatar");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc Get all users - admin only
// @route GET /api/users/admin/all
// @access Private/Admin
const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, getUsers, getAllUsersAdmin };
