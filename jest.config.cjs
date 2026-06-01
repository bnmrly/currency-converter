module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/src/test/styleMock.ts",
    "\\.(png|jpg|jpeg|gif|svg|webp|avif)$": "<rootDir>/src/test/fileMock.ts",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
