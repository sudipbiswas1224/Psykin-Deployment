// module.exports = {
//   JWT_SECRET: process.env.JWT_SECRET || "defaultsecret",
//   JWT_EXPIRES_IN: "1d",
//   AI: {
//     MODEL: "gpt-3.5-turbo", // ✅ switched to free version
//     TEMPERATURE: 0.7,
//     MAX_TOKENS: 500
//   },
//   CRISIS_KEYWORDS: {
//     high: ["suicide", "kill myself", "end it all"],
//     medium: ["self harm", "give up", "can’t go on"],
//     low: ["sad", "lonely", "anxious"]
//   }
// };


module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "defaultsecret",
  JWT_EXPIRES_IN: "1d",
  AI: {
    MODEL: "gpt-4o-mini",  // ✅ use the supported free model
    TEMPERATURE: 0.7,
    MAX_TOKENS: 500
  },
  CRISIS_KEYWORDS: {
    high: ["suicide", "kill myself", "end it all"],
    medium: ["self harm", "give up", "can’t go on"],
    low: ["sad", "lonely", "anxious"]
  }
};
