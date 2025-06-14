const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const History = require('./historyModel');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/codehistory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.post('/save', async (req, res) => {
  const { original, user } = req.body;
  const entry = new History({ original, user });
  await entry.save();
  res.json({ message: "Saved!" });
});

app.get('/history', async (req, res) => {
  const all = await History.find().sort({ createdAt: -1 }).limit(5);
  res.json(all);
});

app.delete('/clear', async (req, res) => {
  await History.deleteMany({});
  res.json({ message: "History cleared!" });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
