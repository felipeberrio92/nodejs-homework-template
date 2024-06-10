const { users } = require("../validation/validation.db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUserByEmail = async (_email) => {
  try {
    const userExist = await users.findOne({ email: _email }).exec();
    return userExist;
  } catch (error) {
    console.error(error);
  }
};

const createUser = async (body) => {
  try {
    const password = await bcrypt.hash(
      body.password,
      parseInt(process.env.SALT)
    );
    const token = jwt.sign({ ...body, password }, process.env.JWT_SECRET);
    const newContact = await users.create({ ...body, password, token });
    return newContact;
  } catch (error) {
    console.error(error);
  }
};

const comparePasswords = async (textPassword, userObject) => {
  try {
    if (textPassword === null || userObject === null) return false;
    return await bcrypt.compare(textPassword, userObject.password);
  } catch (error) {
    console.error(error);
  }
};

const generateToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const updateToken = async (id, token) => {
  try {
    await users.findByIdAndUpdate(id, { token }).exec();
  } catch (error) {
    console.error(error);
  }
};

const updateSubscription = async (id, typeSubscription) => {
  try {
    switch (typeSubscription) {
      case "starter":
        await users.findByIdAndUpdate(id, { subscription: "starter" }).exec();

        break;
      case "pro":
        await users.findByIdAndUpdate(id, { subscription: "pro" }).exec();

        break;
      case "business":
        await users.findByIdAndUpdate(id, { subscription: "bussines" }).exec();

        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getUserByEmail,
  createUser,
  comparePasswords,
  generateToken,
  updateToken,
  updateSubscription,
};
