const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  original: String,
  user: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
