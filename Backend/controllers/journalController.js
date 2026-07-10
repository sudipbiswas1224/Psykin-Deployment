const Journal = require("../models/Journal");
const nlpService = require("../services/nlpService");
const { generateVector } = require('../services/messageAiService')
const { createMemory } = require('../services/vectorService')

// @desc    Create new journal entry
// @route   POST /api/journal/create
// @access  Private
exports.createJournal = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, error: "Title and content are required" });
    }

   
    // Call NLP Service
    const nlpResult = await nlpService.analyzeText(content);

    const [journal, vector] = await Promise.all([
      Journal.create({
        userId: req.user._id,
        title,
        content,
        emotion: nlpResult.detectedEmotion,
        sentiment: nlpResult.sentiment,
        stressLevel: nlpResult.stressLevel,
        keywords: nlpResult.keywords,
        distortions: nlpResult.distortions,
        crisisProbability: nlpResult.crisisProbability,
      }),
      generateVector(content)
    ]);
    console.log('Vector for journal', vector);

    const journalId = journal._id;
    await createMemory({
      messageId: journalId,
      vector,
      metadata: {
        user: req.user._id,
        text: content,
        type: "journal",
        timestamp: Date.now()
      }
    });




    // Store NLP result in res.locals for crisisInterceptor middleware
    res.locals.nlpResult = nlpResult;

    res.status(201).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get all journals for logged in user
// @route   GET /api/journal/all
// @access  Private
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user._id }).sort(
      "-createdAt",
    );

    res.status(200).json({
      success: true,
      data: journals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/update/:id
// @access  Private
exports.updateJournal = async (req, res) => {
  try {
    let journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res
        .status(404)
        .json({ success: false, error: "Journal not found" });
    }

    // Strict ownership validation
    if (journal.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          error: "User not authorized to update this journal",
        });
    }

    const { title, content } = req.body;

    // We update fields and then save() so that Mongoose pre-save hooks (encryption) run
    if (title) journal.title = title;
    if (content) journal.content = content;

    await journal.save();

    res.status(200).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/delete/:id
// @access  Private
exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res
        .status(404)
        .json({ success: false, error: "Journal not found" });
    }

    // Strict ownership validation
    if (journal.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          error: "User not authorized to delete this journal",
        });
    }

    await journal.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
