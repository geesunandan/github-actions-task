import * as Joi from 'joi';

import { validate } from './validator';

describe('Validates Incoming Request Payload', () => {
  describe('validate', () => {
    describe('given valid payload for validation schema', () => {
      it('validates successfully', async () => {
        const data = {
          firstName: 'Random Mike',
          age: 49
        };

        const schema = Joi.object().keys({
          firstName: Joi.string(),
          age: Joi.number()
        });

        await expect(validate(data, schema)).resolves.not.toBeNull();
      });
    });

    describe('given INVALID type for payload', () => {
      it('throws error', async () => {
        const data = {
          firstName: 'random',
          age: 'guess'
        };

        const schema = Joi.object().keys({
          firstName: Joi.string(),
          age: Joi.number()
        });

        await expect(validate(data, schema)).rejects.toThrow();
      });
    });

    describe('given INVALID payload', () => {
      it('throws error', async () => {
        const data = {
          age: 49
        };

        const schema = Joi.object().keys({
          firstName: Joi.string().required(),
          age: Joi.number()
        });

        await expect(validate(data, schema)).rejects.toThrow();
      });
    });
  });
});
