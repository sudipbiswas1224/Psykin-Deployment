const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  choices: [{ type: String, required: true }],
  scores: [{ type: Number, required: true }]
});

const AssessmentTestTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  questions: [QuestionSchema],
  scoringLogic: { type: String, required: true }
});

module.exports = mongoose.model('AssessmentTestTemplate', AssessmentTestTemplateSchema); 