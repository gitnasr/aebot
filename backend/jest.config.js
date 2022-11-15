/** @type {import('jest').Config} */
const config = {
	verbose: true,
	testEnvironment: 'node',
	testMatch: ['**/*.test.js'],
	testPathIgnorePatterns: ['<rootDir>/node_modules/'],
	testTimeout: 300000,

	preset: '@shelf/jest-mongodb',
};

module.exports = config;