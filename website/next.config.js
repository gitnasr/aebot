/**
 * @type {import('next').NextConfig}
 */
const withPWA = require("next-pwa");
const nextConfig = {
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
		disable: process.env.NODE_ENV === "development",
		// sw: 'service-worker.js',
		// buildExcludes: [/middleware-manifest.json$/]

	}, i18n: {
		locales: ["ar"], defaultLocale: "ar",
	},
}
module.exports = withPWA(nextConfig)