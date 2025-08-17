import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (err) {
        if (err.isJoi) {
            const validationErrors = err.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            const error = createHttpError(400, 'Bad Request');
            error.errors = validationErrors;

            return next(error);

        }

        next(err);
    }
};