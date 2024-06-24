/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/helpers/database.mock.ts'],
  moduleNameMapper: {
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@/constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@/helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@/presenters/(.*)$': '<rootDir>/src/presenters/$1',
    '^@/repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@/routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@/schemas/(.*)$': '<rootDir>/src/schemas/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/test/(.*)$': '<rootDir>/test/$1'
  },
  testMatch: ['<rootDir>/src/**/*.test.ts']
};
