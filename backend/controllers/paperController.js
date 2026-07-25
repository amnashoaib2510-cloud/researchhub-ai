const Paper = require("../models/Paper");
const Notification = require("../models/Notification");
const Project = require("../models/Project");
const { extractKeywords, summarizeText } = require("../utils/aiService");

// @desc Upload a research paper
// @route POST /api/papers
// @access Private
const uploadPaper = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please attach a paper file (PDF/DOC/DOCX/TXT)" });
    }

    const { title, authors, project, category, abstract, keywords } = req.body;

    const paper = await Paper.create({
      title,
      authors: authors ? authors.split(",").map((a) => a.trim()) : [],
      project: project || undefined,
      category,
      abstract,
      keywords: keywords ? keywords.split(",").map((k) => k.trim()) : extractKeywords(abstract || title),
      uploadedBy: req.user._id,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      versions: [
        {
          versionNumber: 1,
          fileUrl: `/uploads/${req.file.filename}`,
          fileName: req.file.originalname,
          uploadedBy: req.user._id,
          notes: "Initial upload",
        },
      ],
    });

    // Notify project members if attached to a project
    if (project) {
      const proj = await Project.findById(project);
      if (proj) {
        const recipients = proj.members
          .map((m) => m.user)
          .filter((id) => id.toString() !== req.user._id.toString());

        await Promise.all(
          recipients.map((recipient) =>
            Notification.create({
              recipient,
              type: "PAPER_UPLOADED",
              title: "New paper uploaded",
              message: `${req.user.name} uploaded "${paper.title}" to ${proj.title}.`,
              relatedProject: proj._id,
            })
          )
        );
      }
    }

    res.status(201).json(paper);
  } catch (error) {
    next(error);
  }
};

// @desc Get papers (with search & category filter)
// @route GET /api/papers
// @access Private
const getPapers = async (req, res, next) => {
  try {
    const { search, category, project } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (project) filter.project = project;
    if (search) {
      filter.$text = { $search: search };
    }

    const papers = await Paper.find(filter)
      .populate("uploadedBy", "name email role")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.json(papers);
  } catch (error) {
    next(error);
  }
};

// @desc Get a single paper
// @route GET /api/papers/:id
// @access Private
const getPaperById = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate("uploadedBy", "name email role")
      .populate("project", "title");

    if (!paper) return res.status(404).json({ message: "Paper not found" });

    res.json(paper);
  } catch (error) {
    next(error);
  }
};

// @desc Upload a new version of an existing paper
// @route POST /api/papers/:id/versions
// @access Private
const addPaperVersion = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please attach a file" });
    }

    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const nextVersion = (paper.versions.at(-1)?.versionNumber || 0) + 1;

    paper.versions.push({
      versionNumber: nextVersion,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      uploadedBy: req.user._id,
      notes: req.body.notes || "",
    });

    // Keep the "current" file pointing at the latest version
    paper.fileUrl = `/uploads/${req.file.filename}`;
    paper.fileName = req.file.originalname;
    paper.fileSize = req.file.size;

    await paper.save();
    res.json(paper);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a paper
// @route DELETE /api/papers/:id
// @access Private
const deletePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const isOwner = paper.uploadedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to delete this paper" });
    }

    await paper.deleteOne();
    res.json({ message: "Paper removed" });
  } catch (error) {
    next(error);
  }
};

// @desc Generate/refresh AI summary for a paper
// @route POST /api/papers/:id/summarize
// @access Private
const summarizePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const summary = await summarizeText(paper.abstract || paper.title, paper.title);
    paper.aiSummary = summary;
    await paper.save();

    res.json({ aiSummary: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPaper,
  getPapers,
  getPaperById,
  addPaperVersion,
  deletePaper,
  summarizePaper,
};
