import HttpError from "./HttpError.js";

function checkUniqueKeyValue(err, next) {
  if (err.code === 11000) {
    const message = err.keyValue.name ? "name" : "email";
    next(
      HttpError(
        400,
        `a contact with that ${message}: '${err.keyValue[message]}' already exists, try another`
      )
    );
  }
}

export default checkUniqueKeyValue;
