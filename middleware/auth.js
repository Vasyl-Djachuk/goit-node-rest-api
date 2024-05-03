import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../model/user.js";

const auth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (typeof authorization === "undefined")
    next(HttpError(401, "Not authorized"));

  const [bearer, token] = authorization.split(" ", 2);
  if (bearer !== "Bearer") next(HttpError(401, "Invalid token"));

  jwt.verify(token, process.env.SECRET_REY, async (err, decode) => {
    if (err !== null) {
      if (err.name === "TokenExpiredError") {
        return next(HttpError(401, "Token expired"));
      }

      return next(HttpError(401, "Not authorized"));
    }

    const user = await User.findById({ _id: decode.id });
    if (!user || user.token !== token)
      return next(HttpError(401, "Not authorized"));

    req.user = user;
    next();
  });
};
export default auth;
