const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/amplify/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^public/(.*)$': '<rootDir>/public/$1',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    uuid: '<rootDir>/node_modules/uuid',
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
  testEnvironment: 'jest-environment-jsdom',
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  coverageReporters: ['clover', 'json', 'lcov', 'cobertura', ['text', { skipFull: true }]],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
