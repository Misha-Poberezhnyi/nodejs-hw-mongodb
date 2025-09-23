import Joi from "joi";

export const resetPasswordEmailShema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required().min(6),
});