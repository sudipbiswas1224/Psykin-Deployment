const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['video', 'article', 'activity', 'music']
    },
    tags: {
        type: [String],
        required: true,
        // e.g., ['depression', 'anxiety', 'stress', 'mindfulness']
    },
    targetSeverity: {
        type: String,
        required: true,
        enum: ['mild', 'moderate', 'severe', 'all'], // 'all' if it's generally applicable
        default: 'all'
    }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
