import pino, { ChildLoggerOptions } from 'pino';

const logger = pino();

function childLogger(bindings: any = {}, options: ChildLoggerOptions = {}) {
  const logBindings = { ...bindings };

  return logger.child(logBindings, options);
}

export { logger as default, childLogger };
