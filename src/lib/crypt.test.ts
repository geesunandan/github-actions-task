import { hash, compareWithHashValue } from './crypt';

describe('Crypt', () => {
  describe('hash()', () => {
    describe('given valid string', () => {
      it('generates a hash', async () => {
        const inputText = 'test';
        const generatedHash = await hash(inputText);

        expect(generatedHash).not.toBeNull();
      });
    });
  });

  describe('compareWithHashValue()', () => {
    describe('given valid string', () => {
      it('matches strings', async () => {
        const string = 'test';
        const expectedHashString = await hash(string);

        const result = await compareWithHashValue(string, expectedHashString);

        expect(result).toEqual(true);
      });
    });

    describe('given INVALID string', () => {
      it('does not matches strings', async () => {
        const string = 'test';
        const randomString = 'testing';
        const expectedHashString = await hash(string);

        const result = await compareWithHashValue(randomString, expectedHashString);

        expect(result).toEqual(false);
      });
    });
  });
});
