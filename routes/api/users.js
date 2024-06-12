const express = require("express");
const { userSchema } = require("../../validation/user.validation");
const {
  getUserByEmail,
  createUser,
  comparePasswords,
  generateToken,
  updateToken,
  updateSubscription,
  updateAvatarURL,
} = require("../../models/users");
const verifyToken = require("../../middlewares/auth.middleware");
const router = express.Router();

const multer = require("multer");
const storage = require("../../middlewares/static.middleware");
const upload = multer({ storage });

const path = require("path");
const fs = require("fs");
const jimp = require("jimp");

router.post("/login", async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate({
      email: req.body.email,
      password: req.body.password,
    });
    if (error) {
      res.status(400);
      res.json({
        message: error.message,
      });
    } else {
      const getUser = await getUserByEmail(value.email);
      const match = await comparePasswords(value.password, getUser);
      if (!getUser || !match) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }

      const token = await generateToken(value);
      await updateToken(getUser.id, token);

      res.status(200);
      res.json({ email: value.email, token });
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate({
      email: req.body.email,
      password: req.body.password,
    });
    if (error) {
      res.status(400);
      res.json({
        message: error.message,
      });
      return;
    } else {
      const user = await getUserByEmail(value.email);
      if (user !== null) {
        res.status(409);
        res.json({
          message: "Email in use",
        });
        return;
      } else {
        const newUser = await createUser(value);
        res.status(201);
        res.json(newUser);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/logout", verifyToken, async (req, res, next) => {
  try {
    const getUser = await getUserByEmail(req.email);

    await updateToken(getUser.id, null);

    res.status(204);
    res.json();
  } catch (error) {
    console.error(error);
  }
});

router.get("/current", verifyToken, async (req, res, next) => {
  try {
    const getUser = await getUserByEmail(req.email);
    res.status(200);
    res.json({ email: getUser.email, subscription: getUser.subscription });
  } catch (error) {
    console.error(error);
  }
});

router.patch("/", verifyToken, async (req, res, next) => {
  try {
    if (req.body.subscription) {
      const getUser = await getUserByEmail(req.email);
      await updateSubscription(getUser.id, req.body.subscription);
    }
    res.status(200);
    res.json();
  } catch (error) {
    console.error(error);
  }
});

router.patch(
  "/avatars",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    try {
      console.log(req.file);
      const getUser = await getUserByEmail(req.email);
      const filepath =
        process.env.STATIC_AVATARS +
        `avatar-${getUser.id}` +
        path.extname(req.file.originalname);
      const image = await jimp.read(req.file.path);
      image.resize(250, 250);
      image.write(filepath);
      await updateAvatarURL(
        getUser.id,
        process.env.HOST + filepath.split("public/")[1]
      );
      fs.unlink(req.file.path, (error) => error);
      res.status(200).json({
        avatarURL: process.env.HOST + filepath.split("public/")[1],
      });
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
