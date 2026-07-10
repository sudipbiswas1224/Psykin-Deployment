// require('dotenv').config();
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const httpServer = require('http').createServer(app);
const { initSocketServer } = require('./services/socketService');
const assessmentRoutes = require('./routes/assessment');
const analyticsRoutes = require('./routes/analytics');
const AssessmentTestTemplate = require('./models/AssessmentTestTemplate');
const Resource = require('./models/Resource');
const Doctor = require('./models/Doctor');



const coreOptions = {
  origin: process.env.CLIENT_URL || process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200
}

// Start server
const PORT = process.env.PORT || 5000;
app.use('/api/assessment', assessmentRoutes);
app.use('/api', analyticsRoutes);


// Connect to MongoDB and then start the server
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('✅ MongoDB connected');
  initSocketServer(httpServer); // Initialize the socket server after successful MongoDB connection
  console.log('Socket server initialized')

  // Seed data after successful connection
  await autoSeedAssessments();
  await autoSeedResources();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

// for auto seeding the database with assessments and resources if they are empty
async function autoSeedAssessments() {
  const count = await AssessmentTestTemplate.countDocuments();
  if (count === 0) {
    const seedAssessments = require('./data/seedAssessments');
    await seedAssessments();
  }
}

// for auto seeding the database with resources if they are empty
async function autoSeedResources() {
  const count = await Resource.countDocuments();
  if (count === 0) {
    const seedResources = require('./data/seedResources');
    await seedResources();
  }
}


