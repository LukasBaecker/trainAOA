const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  projects: [
    {
      _id: false,
      projectname: "string",
      projectid: mongoose.Schema.Types.ObjectId,
    },
  ],
  ownprojects: [
    {
      _id: false,
      projectname: "string",
      projectid: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const user = mongoose.model("users", userSchema);

module.exports = user;
