const Conversation = require('../models/Conversation');

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ userId });

    const totalMessages = conversations.reduce(
      (sum, convo) => sum + convo.messages.length,
      0
    );

    res.json({
      success: true,
      data: {
        totalConversations: conversations.length,
        totalMessages
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Analytics failed' });
  }
};
