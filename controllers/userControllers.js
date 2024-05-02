import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normEmail = email.toLowerCase();

    const user = await User.findOne({ email: normEmail });
    if (user !== null) next(HttpError(409, "Email in use"));

    const paswwordHashed = bcrypt.hashSync(password, 10);
    const addedUser = await User.create({
      password: paswwordHashed,
      email: normEmail,
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
    if (user === null) next(HttpError(401, "Email or password is wrong"));

    const isMatch = bcrypt.compareSync(password, user.password);

    if (isMatch === false) next(HttpError(401, "Email or password is wrong"));

    const token = jwt.sign({ id: user._id }, process.env.SECRET_REY, {
      expiresIn: "10h",
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
export default {
  userLogout,
  userLogin,
  userRegister,
  currentUser,
  updateSubscription,
};
