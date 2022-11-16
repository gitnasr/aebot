/**
 * @type {import('next').NextConfig}
 */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
	register: true,
	runtimeCaching,
	buildExcludes: [/middleware-manifest.json$/],
  });
const nextConfig = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },

  i18n: {
    locales: ["ar"],
    defaultLocale: "ar",
  },
};

module.exports = withPWA(nextConfig);
