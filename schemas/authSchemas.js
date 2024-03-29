import Joi from "joi";

export const createUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

export const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
});

export const updateUserSubscriptionSchema = Joi.object({
  subscription: Joi.string().required().valid("starter", "pro", "business"),
});
