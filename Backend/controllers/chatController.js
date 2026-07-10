const messageModel = require('../models/message');
const nlpService = require('../services/nlpService');
const { generateResponse } = require('../services/messageAiService');

// get all the chat history of the user
async function getChatHistory(req, res){
    try {
        const user = req.user;

        const messages = await messageModel.find({ user: user._id }).sort({ updatedAt: 1 }).limit(80).lean();
        res.status(200).json({
            success: true, 
            messages,
            message: 'Chat history fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history'
        });
    }
}

// REST endpoint handler for sending messages (integrated with nlp + crisis interceptor)
async function sendMessage(req, res) {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // Call NLP Service and store in res.locals for crisisInterceptor middleware
        const nlpResult = await nlpService.analyzeText(message);
        res.locals.nlpResult = nlpResult;

        // Call AI to generate companion response
        const botReply = await generateResponse([{ role: 'user', parts: [{ text: message }] }]);

        // Save exchange to DB
        await messageModel.create({
            user: req.user._id,
            role: 'user',
            content: message
        });

        await messageModel.create({
            user: req.user._id,
            role: 'model',
            content: botReply
        });

        res.status(200).json({
            success: true,
            message: botReply,
            metadata: {
                emotion: nlpResult.detectedEmotion,
                crisisLevel: nlpResult.crisisProbability >= 0.70 ? 'high' : 'none'
            }
        });
    } catch (error) {
        console.error('REST Chat handler failed:', error);
        res.status(500).json({ success: false, error: 'Failed to process message' });
    }
}

module.exports = {
    getChatHistory,
    sendMessage
};