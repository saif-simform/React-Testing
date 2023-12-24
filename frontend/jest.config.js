module.exports = {
  displayName: 'React Testing - Test',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testMatch: ["<rootDir>/src/**/*.test.js"], // To provide the root file
  transformIgnorePatterns: ['^.+\\.svg$', '/node_modules/(?!(flatpickr)/)'], //To ignore different import pattern
  transform: {
    "^.+\\.jsx?$": "babel-jest", // To suport jsx element and different import pattern
    "\\.(css)$": "<rootDir>/public/css-transform.js"
  },
  modulePaths: ['<rootDir>'],
  roots: ['<rootDir>'],
  setupFiles: ["<rootDir>/src/services/api.service.js"], // To setup service files or modules
  testEnvironmentOptions: { //Disable warning msg
    errorOnDeprecated: false,
  },
  moduleNameMapper: {  
    "\\.(css)$": "<rootDir>/public/css-transform.js" // To import any library directly
  },
};
