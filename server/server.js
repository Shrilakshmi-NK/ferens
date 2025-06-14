const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const History = require('./historyModel');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB with logging
mongoose.connect('mongodb://localhost:27017/codehistory', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Save comparison history
app.post('/save', async (req, res) => {
  const { original, user } = req.body;
  try {
    const entry = new History({ original, user });
    await entry.save();
    res.json({ message: "✅ Saved!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to save", error });
  }
});

// ✅ Get last 5 entries
app.get('/history', async (req, res) => {
  try {
    const all = await History.find().sort({ createdAt: -1 }).limit(5);
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch history", error });
  }
});

// ✅ Clear history
app.delete('/clear', async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({ message: "🗑️ History cleared!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to clear history", error });
  }
});

// ✅ Start server
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
