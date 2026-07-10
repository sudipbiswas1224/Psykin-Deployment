const { GoogleGenAI } = require('@google/genai');

class NlpService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY_NLP || process.env.GEMINI_API_KEY_DOCTOR || process.env.GEMINI_API_KEY_CHAT;
    if (!apiKey) {
      console.warn('⚠️  Warning: No Gemini API Key found in environment variables. NLP Service will use fallback values.');
      this.ai = null;
    } else {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async analyzeText(text) {
    if (!text) {
      return this._getFallbackResponse();
    }

    if (!this.ai) {
      return this._getFallbackResponse();
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: text,
        config: {
          systemInstruction: `You are an expert mental health text analytics assistant.
Your task is to analyze the user input text and return a JSON object with:
- detectedEmotion: The primary emotion detected in the text (e.g. joy, sadness, anger, anxiety, calm, neutral).
- sentiment: The sentiment of the text (e.g. positive, negative, neutral).
- stressLevel: A float between 0.0 (no stress) and 1.0 (extreme stress).
- keywords: Key words/concepts extracted from the text (array of strings).
- distortions: Any cognitive distortions identified (e.g. catastrophizing, all-or-nothing thinking, emotional reasoning, overgeneralization). Return empty array if none.
- crisisProbability: A float between 0.0 (no crisis/self-harm risk) and 1.0 (imminent self-harm/suicide risk). Must be high (>=0.70) if the user indicates self-harm, hopelessness, suicide, or crisis.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              detectedEmotion: { type: 'STRING' },
              sentiment: { type: 'STRING' },
              stressLevel: { type: 'NUMBER', description: 'Float between 0.0 and 1.0 representing stress severity.' },
              keywords: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              },
              distortions: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              },
              crisisProbability: { type: 'NUMBER', description: 'Float between 0.0 and 1.0 representing self-harm/suicidal risk.' }
            },
            required: ['detectedEmotion', 'sentiment', 'stressLevel', 'keywords', 'distortions', 'crisisProbability']
          }
        }
      });

      const parsed = JSON.parse(response.text);
      console.log(parsed)

      return {
        success: true,
        detectedEmotion: parsed.detectedEmotion || 'neutral',
        sentiment: parsed.sentiment || 'neutral',
        stressLevel: typeof parsed.stressLevel === 'number' ? parsed.stressLevel : 0,
        keywords: parsed.keywords || [],
        distortions: parsed.distortions || [],
        crisisProbability: typeof parsed.crisisProbability === 'number' ? parsed.crisisProbability : 0
      };
    } catch (error) {
      console.error('⚠️  NLP Service Error (Gemini):', error.message);
      return this._getFallbackResponse();
    }
  }

  _getFallbackResponse() {
    return {
      success: false,
      detectedEmotion: 'neutral',
      sentiment: 'neutral',
      stressLevel: 0,
      keywords: [],
      distortions: [],
      crisisProbability: 0
    };
  }
}

module.exports = new NlpService();
