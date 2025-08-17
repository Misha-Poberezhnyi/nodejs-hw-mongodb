import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name must be less than or equal to 20 characters',
        'any.required': 'Name is a required field',
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Phone number must be a string',
        'string.empty': 'Phone number is required',
        'string.min': 'Phone number must be at least 3 characters',
        'string.max': 'Phone number must be less than or equal to 20 characters',
        'any.required': 'Phone number is a required field',
    }),
    email: Joi.string().email().min(3).max(20).required().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'string.min': 'Email must be at least 3 characters',
        'string.max': 'Email must be less than or equal to 20 characters',
        'any.required': 'Email is a required field',
    }),
    isFavourite: Joi.boolean().messages({
        'boolean.base': 'isFavourite must be true or false',
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
        'string.base': 'Contact type must be a string',
        'any.only': 'Contact type must be one of personal, work, or home',
        'any.required': 'Contact type is required',
    }),
});


export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name must be less than or equal to 20 characters',
    }),
    phoneNumber: Joi.string().min(3).max(20).messages({
        'string.base': 'Phone number must be a string',
        'string.min': 'Phone number must be at least 3 characters',
        'string.max': 'Phone number must be less than or equal to 20 characters',
    }),
    email: Joi.string().email().min(3).max(20).messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email address',
        'string.min': 'Email must be at least 3 characters',
        'string.max': 'Email must be less than or equal to 20 characters',
    }),
    isFavourite: Joi.boolean().messages({
        'boolean.base': 'isFavourite must be true or false',
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').messages({
        'string.base': 'Contact type must be a string',
        'any.only': 'Contact type must be one of personal, work, or home',
    }),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});
