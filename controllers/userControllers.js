import User from "../model/user.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normEmail = email.toLowerCase();

    const user = await User.findOne({ email: normEmail });
    if (user !== null) res.status(409).send({ message: "Email in use" });

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
