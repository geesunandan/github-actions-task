import * as Joi from 'joi';

export const authLoginSchema = Joi.object().keys({
  email: Joi.string().email().max(50).required(),
  password: Joi.string().required()
});

export const refreshSchema = Joi.object().keys({
  refreshToken: Joi.string().required()
});
