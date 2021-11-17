const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
        sw: 'service-worker.js',
        buildExcludes: [/middleware-manifest.json$/]


  },
  i18n: {
    locales: ["ar"],
    defaultLocale: "ar",
  },

});