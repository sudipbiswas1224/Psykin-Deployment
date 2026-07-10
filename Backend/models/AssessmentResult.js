const mongoose = require('mongoose');

const AssessmentResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testType: { type: String, required: true },
  responses: [{ type: Number, required: true }],
  totalScore: { type: Number, required: true },
  interpretation: { type: String, required: true },
  phase: { type: String, required: true },
  date: { type: Date, default: Date.now },
  feedback: { type: String }
});

module.exports = mongoose.model('AssessmentResult', AssessmentResultSchema);