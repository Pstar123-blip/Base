import { createDefaultEsmPreset, pathsToModuleNameMapper } from 'ts-jest';

import tsconfig from './tsconfig.json' with { type: 'json' };

export default {
  ...createDefaultEsmPreset({ tsconfig: './tsconfig.json' }),
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
      useESM: true,
    }),
  },
  coverageDirectory: './coverage',
  coverageProvider: 'v8',
};
