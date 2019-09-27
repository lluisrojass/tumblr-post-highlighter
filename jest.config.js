module.exports = {
  coverageDirectory: '<rootDir>/reports/coverage',
  coverageReporters: ['lcov', 'json'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/scripts/background/Installer/index.ts',
    '<rootDir>/src/scripts/background/UI/index.ts',
    '<rootDir>/src/scripts/content/index.ts',
    '<rootDir>/src/scripts/content/scripts/APISniffer/index.ts',
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<roorDir>/node_modules/',
  ],
  roots: ['<rootDir>/__tests__/', '<rootDir>/src/'],
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/src/$1'
  },
  testRegex: '__tests__/.+\\.test\\.(j|t)sx?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  setupFiles: [
    '<rootDir>/jest.setup.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.env.setup.js'
  ],
  bail: 1,
  verbose: true
}