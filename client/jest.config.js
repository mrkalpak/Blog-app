module.exports = {
    // Specify the test environment (typically 'jsdom' for React projects)
    testEnvironment: 'jsdom',
  
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
  
    // A list of paths to modules that run some code to configure or set up the testing environment before each test
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
    // The glob patterns Jest uses to detect test files
    testMatch: [
      "**/?(*.)+(test).[jt]s?(x)" // This pattern will find any .test.js/.test.jsx/.test.ts/.test.tsx files
    ],
  
    // Transform JS files using Babel
    transform: {
      "^.+\\.js$": "babel-jest"
    },
  
    // Ignore transforming certain modules from node_modules, except the ones you want to include
    transformIgnorePatterns: [
      "/node_modules/(?!axios/.*)"
    ],
  };
  