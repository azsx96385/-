//使用 mongoose - Schema
const mongoose = require("mongoose");
const Scehma = mongoose.Schema;

const userSchema = new Scehma({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirm_password: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("users", userSchema);
