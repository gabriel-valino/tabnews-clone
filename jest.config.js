const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: ".",
});

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>/"],
  setupFiles: ["<rootDir>/jest.env.js"],
});

module.exports = jestConfig;
