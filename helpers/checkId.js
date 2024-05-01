import HttpError from "./HttpError.js";

const checkId = (id, next) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(HttpError(400, "Invalid id"));
  }
};
export default checkId;
