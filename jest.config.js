const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-markdown|rehype-sanitize|remark-gfm|unified|vfile|unist-util-stringify-position|bail|is-plain-obj|trough|vfile-message|remark-parse|mdast-util-from-markdown|mdast-util-to-string|micromark|decode-named-character-reference|character-entities|mdast-util-to-hast|unist-util-position|unist-util-visit)/)"
  ],
  testPathIgnorePatterns: ["<rootDir>/tests/e2e/"]
};

module.exports = createJestConfig(customJestConfig);
