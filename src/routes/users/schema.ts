import * as Joi from 'joi';

export const userRegistrationSchema = Joi.object().keys({
  password: Joi.string().required(),
  email: Joi.string().email().max(50).required(),
  name: Joi.string().max(30).required()
});
