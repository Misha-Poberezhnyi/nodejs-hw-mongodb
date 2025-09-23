import Joi from "joi";

export const sendResetPasswordEmailShema = Joi.object({
    email: Joi.string().required().email(),
});