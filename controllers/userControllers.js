import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normEmail = email.toLowerCase();

    const user = await User.findOne({ email: normEmail });
    if (user !== null) {
      return next(HttpError(409, "Email in use"));
    }
    const avatarURL = gravatar.url(normEmail);
    const paswwordHashed = bcrypt.hashSync(password, 10);
    const addedUser = await User.create({
      password: paswwordHashed,
      email: normEmail,
      avatarURL,
    });
    res.status(201).send({
      user: { email: addedUser.email, subscription: addedUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normEmail = email.toLowerCase();

    const user = await User.findOne({ email: normEmail });
    if (user === null)
      return next(HttpError(401, "Email or password is wrong"));

    const isMatch = bcrypt.compareSync(password, user.password);

    if (isMatch === false)
      return next(HttpError(401, "Email or password is wrong"));

    const token = jwt.sign({ id: user._id }, process.env.SECRET_REY, {
      expiresIn: "1d",
    });

    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
const currentUser = (req, res, next) => {
  res.status(200).send({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

const updateSubscription = async (req, res, next) => {
  try {
    const { subscription, id = req.user.id } = req.body;

    const subscriptionStatus = await User.findByIdAndUpdate(
      { _id: id },
      { subscription }
    );
    res.status(200).json(subscriptionStatus);
  } catch (error) {
    next(error);
  }
};

const uploadAvatars = async (req, res, next) => {
  try {
    const avatarPath = path.join(
      process.cwd(),
      "public/avatars",
      req.file.filename
    );
    if (!req.user.avatarURL.includes("gravatar")) {
      await fs.unlink(path.join(process.cwd(), "public", req.user.avatarURL));
    }

    await fs.rename(req.file.path, avatarPath);

    await Jimp.read(avatarPath)
      .then((image) => {
        return image.resize(250, 250).quality(90).write(avatarPath);
      })
      .catch((err) => {
        console.log(err);
      });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: `/avatars/${req.file.filename}`,
      },
      { new: true }
    );
    if (user === null) return next(HttpError(404));

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user === null) return next(HttpError(404));
    res
      .status(200)
      .sendFile(path.join(process.cwd(), "public", user.avatarURL));
  } catch (error) {
    next(HttpError(error));
  }
};
export default {
  userLogout,
  userLogin,
  userRegister,
  currentUser,
  updateSubscription,
  uploadAvatars,
  getAvatar,
};
