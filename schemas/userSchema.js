import Joi from "joi";

export const userRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});
export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
}).messages({
  "any.required": "missing required field email",
});
