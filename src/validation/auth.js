import Joi from "joi";

export const registerUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is a required field',
  }),
    email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'string.empty': 'Email is required',
    'any.required': 'Email is a required field',
  }),
    password: Joi.string().required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
    'any.required': 'Password is a required field',
  }),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
    password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is a required field',
  }),
});