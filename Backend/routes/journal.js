const express = require("express");
const {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalController");

const { authenticate } = require("../middleware/auth");
const { crisisInterceptor } = require("../middleware/crisisInterceptor");

const router = express.Router();

// Apply authentication middleware to all journal routes
router.use(authenticate);

router.post("/create", crisisInterceptor("journal"), createJournal);
router.get("/all", getJournals);
router.put("/update/:id", updateJournal);
router.delete("/delete/:id", deleteJournal);

module.exports = router;
