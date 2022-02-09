const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: String, default: false },
  date_added: { type: Date, default: Date.now },
});

module.exports = mongoose.model("todo", schema);
