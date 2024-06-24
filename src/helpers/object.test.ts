import { withoutAttrs, withOnlyAttrs, listWithoutAttrs } from './object';

describe('Helpers: object', () => {
  describe('withoutAttrs()', () => {
    const obj = {
      a: 1,
      b: 2
    };

    describe('given one key', () => {
      it('omits correct key', () => {
        expect(withoutAttrs(obj, ['a'])).toStrictEqual({ b: 2 });
      });
    });

    describe('given multiple keys', () => {
      it('omits correct keys', () => {
        expect(withoutAttrs(obj, ['a', 'b'])).toStrictEqual({});
      });
    });

    describe('given NO keys', () => {
      it('does not omit anything', () => {
        expect(withoutAttrs(obj, [])).toStrictEqual({ a: 1, b: 2 });
      });
    });

    describe('given keys DOES NOT match with object keys', () => {
      it('does not omit anything', () => {
        expect(withoutAttrs(obj, ['c', 'd'])).toStrictEqual({ a: 1, b: 2 });
      });
    });
  });

  describe('listWithoutAttrs()', () => {
    describe('given valid keys', () => {
      it('recursively omit keys from nested array of objects', () => {
        const list = [
          {
            a: 1,
            b: 2
          },
          {
            c: 3,
            d: 4
          }
        ];

        expect(listWithoutAttrs(list, ['a', 'c'])).toStrictEqual([{ b: 2 }, { d: 4 }]);
      });
    });
  });

  describe('withOnlyAttrs()', () => {
    const obj = {
      a: 1,
      b: 2
    };

    describe('given single key', () => {
      it('retains the single key specified in attrs', () => {
        expect(withOnlyAttrs(obj, ['a'])).toStrictEqual({ a: 1 });
      });
    });

    describe('given multiple keys', () => {
      it('retains the keys specified in attrs', () => {
        expect(withOnlyAttrs(obj, ['a', 'b'])).toStrictEqual(obj);
      });
    });

    describe('given none of the keys are present', () => {
      it('returns an empty object', () => {
        expect(withOnlyAttrs(obj, ['c', 'd'])).toStrictEqual({});
      });
    });

    describe('given there are some unavailable keys', () => {
      it('retains keys available to object', () => {
        expect(withOnlyAttrs(obj, ['a', 'c'])).toStrictEqual({ a: 1 });
      });
    });

    describe('given keys list is empty', () => {
      it('returns an empty object', () => {
        expect(withOnlyAttrs(obj, [])).toStrictEqual({});
      });
    });
  });
});
