const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const History = require('./historyModel');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
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

// ✅ Load all history (for history.html)
app.get('/load-history', async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.json(history.map(item => ({
      _id: item._id,
      code1: item.original,
      code2: item.user,
      createdAt: item.createdAt
    })));
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to load history", error });
  }
});

// ✅ Delete specific item by ID
app.delete('/delete-history/:id', async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Entry deleted!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete entry", error });
  }
});

// ✅ Delete all history
app.delete('/delete-history', async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({ message: "🧹 All history cleared!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to clear history", error });
  }
});

// ✅ Start server
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
