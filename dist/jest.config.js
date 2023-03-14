"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sync object
const config = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testPathIgnorePatterns: ["dist/"],
};
exports.default = config;
