const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  original: String,
  user: String
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('History', historySchema);
