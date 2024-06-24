export function listWithoutAttrs<T>(obj: object[], attrsToExclude: any[]): T[] {
  return obj.map((item) => withoutAttrs<T>(item, attrsToExclude));
}

export function withoutAttrs<T>(obj: any, attrsToExclude: any[]): T {
  if (Array.isArray(obj)) {
    throw new TypeError('withoutAttrs() expects first argument to be a plain object, array given.');
  }

  const result: any = {};

  Object.keys(obj).forEach((key: string) => {
    if (!attrsToExclude.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

export function withOnlyAttrs<T>(obj: any, attrs: any[]): T {
  const result: any = {};

  Object.keys(obj).forEach((key) => {
    if (attrs.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

export function isObjectEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}

export function isEmpty(obj: any) {
  if (Array.isArray(obj)) {
    if (!obj.length) {
      return true;
    }

    return false;
  }

  return isObjectEmpty(obj);
}
