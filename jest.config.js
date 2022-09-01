export const roots = ['<rootDir>/src'];
export const transform = {
  '^.+\\.tsx?$': 'ts-jest',
};
export const setupFilesAfterEnv = [
  '@testing-library/react/cleanup-after-each',
  '@testing-library/jest-dom/extend-expect',
];
export const testRegex = '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$';
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
