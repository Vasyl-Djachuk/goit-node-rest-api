import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import sgMail from "@sendgrid/mail";

import crypto from "node:crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normEmail = email.toLowerCase();

    const user = await User.findOne({ email: normEmail });
    if (user !== null) {
      return next(HttpError(409, "Email in use"));
    }

    const paswwordHashed = bcrypt.hashSync(password, 10);

    const verificationToken = crypto.randomUUID();
    const message = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Confirm you registration",
      html: `To confirm you registration please click on the <a href="http://localhost:${process.env.PORT}/api/users/verify/${verificationToken}"  target="_blank">link</a> `,
    };
    sgMail
      .send(message)
      .then()
      .catch((err) => console.log(err));

    const addedUser = await User.create({
      password: paswwordHashed,
      email: normEmail,
      verificationToken,
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
    if (user.verify === false) {
      return next(HttpError(401, "Your account is not verified"));
    }

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

const userVerificationEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });
    if (user === null) return next(HttpError(404, "User not found"));

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.log(error);
  }
};

const resendingEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user === null) return next(HttpError(404));
    if (user.verify)
      return next(HttpError(400, "Verification has already been passed"));

    const message = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Confirm you registration",
      html: `To confirm you registration please click on the <a href="http://localhost:${process.env.PORT}/api/users/verify/${user.verificationToken}"   target="_blank">link</a> `,
    };
    await sgMail.send(message);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.log(error);
  }
};
export default {
  userLogout,
  userLogin,
  userRegister,
  currentUser,
  updateSubscription,
  userVerificationEmail,
  resendingEmail,
};
