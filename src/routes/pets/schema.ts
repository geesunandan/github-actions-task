import * as Joi from 'joi';

export const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  species: Joi.string().valid('cat', 'dog').required(),
  birthYear: Joi.number().max(9999).required(),
  photoUrl: Joi.string(),
  dateAdded: Joi.date(),
  available: Joi.boolean()
});

export const updateSchema = Joi.object().keys({
  name: Joi.string(),
  species: Joi.string().valid('cat', 'dog'),
  birthYear: Joi.number().max(9999),
  photoUrl: Joi.string(),
  dateAdded: Joi.date(),
  available: Joi.boolean()
});
