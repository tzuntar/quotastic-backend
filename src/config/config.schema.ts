import Joi from 'joi';

export const configSchema = Joi.object({
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().default(5432).required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASS: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),
    JWT_SECRET_EXPIRATION: Joi.number().required(),

    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET_EXPIRATION: Joi.number().required(),
});
