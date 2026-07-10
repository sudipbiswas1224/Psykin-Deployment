const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const { generateResponse, generateVector } = require("../services/messageAiService");
const messageModel = require("../models/message");
const { createMemory, queryMemory } = require("../services/vectorService");
const nlpService = require("../services/nlpService");
const { evaluateCrisis } = require("../middleware/crisisInterceptor");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || process.env.FRONTEND_ORIGIN || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // middleware for the socket.io
    io.use(async (socket, next) => {
        const authToken = socket.handshake.auth?.token;
        const headerToken = socket.handshake.headers?.authorization?.startsWith("Bearer ")
            ? socket.handshake.headers.authorization.slice(7)
            : null;
        const token = authToken || headerToken;

        if (!token) {
            return next(new Error("Authentication error: No token found"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId || decoded.id;
            const user = await userModel.findOne({ _id: userId });

            if (!user) {
                return next(new Error("Authentication error : User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            return next(new Error("Authentication error : Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected", socket.user);

        socket.on("user-message", async (messagePayload) => {
            try {
                console.log("Message from user:", messagePayload.content);

                const [userMessage, userMessageVector] = await Promise.all([
                    messageModel.create({
                        user: socket.user._id,
                        role: "user",
                        content: messagePayload.content,
                    }),
                    generateVector(messagePayload.content),
                ]);

                const chatHistory = await messageModel.find({ user: socket.user._id }).sort({ createdAt: -1 }).limit(20).lean();
                const lastMessageTimestamp = chatHistory.length > 0 ? chatHistory[0].createdAt : null;
                const cutoffTimestamp = lastMessageTimestamp ? new Date(lastMessageTimestamp).getTime() : Date.now();

                const memory = await queryMemory({
                    queryVector: userMessageVector,
                    limit: 5,
                    metadata: {
                        user: socket.user._id,
                    },
                    cutoffTimestamp,
                });

                const ltm = [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `
Here is some relevent previous conversation you had:
${memory.map((item) => item.metadata.text).join("\n")}
`,
                            },
                        ],
                    },
                ];
                console.log('LTM is : ', ltm)

                const stm = chatHistory.reverse().map((item) => ({
                    role: item.role,
                    parts: [{ text: item.content }],
                }));
                console.log('STM is : ', stm)

                const [aiResponse, nlpResult] = await Promise.all([
                    generateResponse([...ltm, ...stm]),
                    nlpService.analyzeText(messagePayload.content).catch(err => {
                        console.error("NLP service call failed:", err);
                        return null;
                    })
                ]);

                if (nlpResult) {
                    const { isCrisis, crisisPayload } = await evaluateCrisis(nlpResult, socket.user._id, 'chat', messagePayload.content);
                    if (isCrisis && crisisPayload) {
                        socket.emit("crisis-alert", crisisPayload);
                    }
                }

                socket.emit("ai-response", {
                    content: aiResponse,
                    clientId: messagePayload.clientId || null,
                });


                
                const [responseMessage, aiResponseVector] = await Promise.all([
                    messageModel.create({
                        user: socket.user._id,
                        role: "model",
                        content: aiResponse,
                    }),
                    generateVector(aiResponse),
                ]);

                await Promise.all([
                    createMemory({
                        messageId: userMessage._id,
                        vector: userMessageVector,
                        metadata: {
                            user: socket.user._id,
                            text: messagePayload.content,
                            type: "chat",
                            timestamp: Date.now(),
                        },
                    }),
                    createMemory({
                        messageId: responseMessage._id,
                        vector: aiResponseVector,
                        metadata: {
                            user: socket.user._id,
                            text: aiResponse,
                            type: "chat",
                            timestamp: Date.now(),
                        },
                    }),
                ]);
            } catch (error) {
                console.error("Socket chat handler failed:", error);
                socket.emit("chat-error", {
                    message: "Unable to generate a reply right now. Please try again.",
                });
            }
        });
    });
}

module.exports = { initSocketServer };