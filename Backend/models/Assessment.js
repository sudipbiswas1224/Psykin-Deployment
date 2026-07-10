const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: Number,
  question: String,
  answer: String,
  score: Number
});

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  totalScore: Number,
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
