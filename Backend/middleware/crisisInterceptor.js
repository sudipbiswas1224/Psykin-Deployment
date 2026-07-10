const CrisisEvent = require('../models/CrisisEvent');

// Utility for Socket.IO or manual calls
const evaluateCrisis = async (nlpResult, userId, source, rawText) => {
  const crisisThreshold = 0.70;
  const isCrisis = nlpResult && nlpResult.crisisProbability >= crisisThreshold;

  let crisisPayload = null;

  if (isCrisis) {
    try {
      // Log fire-and-forget crisis event
      CrisisEvent.create({
        userId,
        riskScore: nlpResult.crisisProbability,
        triggeredBy: source,
        rawTextSnippet: rawText ? rawText.substring(0, 500) : '',
        metadata: nlpResult
      }).catch(err => console.error('Failed to log crisis event:', err));
    } catch (err) {
      console.error('Error initiating crisis log:', err);
    }

    crisisPayload = {
      crisisAlert: true,
      crisisLevel: 'high',
      fallbackSuggestions: ['grounding_exercise', 'helpline_directory']
    };
  }

  return { isCrisis, crisisPayload };
};

const buildCrisisResponse = (originalPayload, crisisPayload) => {
  if (!crisisPayload) {
    return originalPayload;
  }
  
  return {
    ...originalPayload,
    ...crisisPayload
  };
};

// Express Middleware wrapper
const crisisInterceptor = (source) => {
  return async (req, res, next) => {
    const originalJson = res.json;

    res.json = async function (data) {
      // Restore res.json to prevent recursive calls
      res.json = originalJson;

      const nlpResult = res.locals.nlpResult;

      if (nlpResult && nlpResult.crisisProbability >= 0.70) {
        try {
          const rawText = req.body.content || req.body.message || '';
          await CrisisEvent.create({
            userId: req.user._id,
            riskScore: nlpResult.crisisProbability,
            triggeredBy: source,
            rawTextSnippet: rawText.substring(0, 500),
            metadata: nlpResult
          });
        } catch (err) {
          console.error('Failed to log crisis event in interceptor:', err);
        }

        const alteredData = {
          success: true,
          crisisAlert: true,
          crisisLevel: 'high',
          fallbackSuggestions: ['grounding_exercise', 'helpline_directory'],
          ...data
        };

        return originalJson.call(this, alteredData);
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = {
  evaluateCrisis,
  buildCrisisResponse,
  crisisInterceptor
};
