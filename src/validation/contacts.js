import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters',
        'any.required': 'Name is a required field',
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'string.pattern.base': 'Phone number format is invalid',
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is a required field',
    }),
    email: Joi.string().min(3).max(20).required().messages({
        'string.email': 'Email must be a valid email address',
    }),
    isFavourite: Joi.boolean().messages({
        'boolean.base': 'isFavourite must be true or false',
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
        'anu.only': 'Contact ttype must be one of personal, work, or other',
        'any.required': 'Contact type is required',
    }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 3 characters',
    }),
    phoneNumber: Joi.string().min(3).max(20).messages({
        'string.pattern.base': 'Phone number format is invalid',
    }),
    email: Joi.string().min(3).max(20).messages({
        'string.email': 'Email must be a valid email address',
    }),
    isFavourite: Joi.boolean().messages({
        'boolean.base': 'isFavourite must be true or false',
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').messages({
        'anu.only': 'Contact type must be one of personal, work, or other',
    }).min(1).messages({
        'object.min': 'At least one field is required for update'
    }),
});