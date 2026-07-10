const mongoose = require('mongoose');

const crisisEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  triggeredBy: {
    type: String,
    enum: ['journal', 'chat'],
    required: true
  },
  rawTextSnippet: {
    type: String,
    maxLength: 500
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CrisisEvent', crisisEventSchema);
