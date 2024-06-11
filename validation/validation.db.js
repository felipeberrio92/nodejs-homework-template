const { Schema, model } = require("mongoose");

const contactSchema = Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  favorite: {
    type: Boolean,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const userSchema = Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

const contacts = model("contacts", contactSchema);
const users = model("users", userSchema);

module.exports = { contacts, users };
