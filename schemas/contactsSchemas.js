import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.bool(),
})
  .min(1)
  .message("Body must have at least one field");

export const updateContactFavoriteSchema = Joi.object({
  favorite: Joi.bool().required(),
});
