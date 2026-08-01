import { createDefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const presetConfig = createDefaultEsmPreset();

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  verbose: true,
  roots: [`${path.join(__dirname, "..")}`],
  setupFilesAfterEnv: ["jest-extended/all", "<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "mts",
    "cts",
    "json",
    "js",
    "jsx",
    "mjs",
    "cjs",
    "node",
  ],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default jestConfig;
