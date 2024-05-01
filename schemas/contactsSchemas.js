import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.string().valid(true, false),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string(),
})
  .or("phone", "email", "name")
  .messages({
    "object.missing": "Body must have at least one field",
  });
export const updateStatus = Joi.object({
  favorite: Joi.string().valid(true, false).required(),
});
