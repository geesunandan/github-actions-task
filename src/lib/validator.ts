import * as Joi from 'joi';

export function validate(data: object, schema: Joi.Schema): Promise<object> {
  return new Promise((resolve, reject) => {
    const options = { abortEarly: false };
    const { error, value } = schema.validate(data, options);

    if (error) {
      reject(error);

      return;
    }

    resolve(value);
  });
}
