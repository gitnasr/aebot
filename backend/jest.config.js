/** @type {import('jest').Config} */
const config = {
	verbose: true,
	testEnvironment: 'node',
	testMatch: ['**/*.test.js'],
	testPathIgnorePatterns: ['<rootDir>/node_modules/'],
	testTimeout: 30000,

	preset: '@shelf/jest-mongodb',
};

module.exports = config;