const AssessmentTestTemplate = require('../models/AssessmentTestTemplate');
const AssessmentResult = require('../models/AssessmentResult');
const scoring = require('../services/scoring');

// List all available test types
exports.listTests = async (req, res) => {
  try {
    const tests = await AssessmentTestTemplate.find({}, 'name');
    res.json(tests.map((test => test.name)));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list tests' });
  }
};

// Get a specific test template by type
exports.getTestTemplate = async (req, res) => {
  try {
    const { type } = req.params;
    console.log(type);

    // Create a robust fuzzy search (case-insensitive regex)
    //const normalizedTypePattern = new RegExp(`^${type}$`, 'i');

    // Find the test using the fuzzy search pattern
    const test = await AssessmentTestTemplate.findOne({ name: type });

    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test template' });
  }
};

// Submit assessment and score it
exports.submitAssessment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testType, responses, phase } = req.body;

    // Create a robust fuzzy search (case-insensitive regex)
    const normalizedTypePattern = new RegExp(`^${testType}$`, 'i');

    const test = await AssessmentTestTemplate.findOne({ name: normalizedTypePattern });
    if (!test) return res.status(404).json({ error: 'Test not found' });

    // Validate responses array length
    if (!Array.isArray(responses) || responses.length !== test.questions.length) {
      return res.status(400).json({ error: 'Invalid responses' });
    }
    // Score using modular logic
    const scorer = scoring[test.scoringLogic];
    if (!scorer) return res.status(500).json({ error: 'Scoring logic not found' });
    const { totalScore, interpretation, feedback } = scorer(responses);
    const result = await AssessmentResult.create({
      userId,
      testType,
      responses,
      totalScore,
      interpretation,
      phase,
      feedback
    });
    res.status(201).json({
      totalScore,
      interpretation,
      feedback,
      resultId: result._id
    });
  } catch (err) {
    res.status(500).json({ error: 'Assessment submission failed' });
  }
};

// Get all past test attempts for a user
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await AssessmentResult.find({ userId }).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// Get progress in a specific test type for a user
// exports.getProgress = async (req, res) => {
//   try {
//     const { userId, testType } = req.params;
//     const results = await AssessmentResult.find({ userId, testType }).sort({ date: 1 });
//     res.json(results);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch progress' });
//   }
// };

exports.getAnalytics = async (req, res) => {
  try {
    console.log("Fetching analytics for user:", req.params.userId);
    const { userId } = req.params;
    const results = await AssessmentResult.find({ userId }).sort({ date: -1 });
    const groupedData = results.reduce((acc, result)=>{
      if(!acc[result.testType]) acc[result.testType] = [];
      acc[result.testType].push({date: result.date, totalScore: result.totalScore });
      return acc;
    }, {});

    // sort it on the basis of date
    for (const testType in groupedData) {
      groupedData[testType].sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    console.log(groupedData);
    res.json(groupedData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}
