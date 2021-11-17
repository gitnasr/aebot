exports.RedisClient = () => {
  const { REDIS_URL } = process.env;
  const Redis = require("ioredis");
  let client;
  let subscriber;

  const opts = {
    // redisOpts here will contain at least a property of connectionName which will identify the queue based on its name
    createClient: function (type, redisOpts) {
      switch (type) {
        case "client":
          if (!client) {
            client = new Redis(REDIS_URL, redisOpts);
          }
          return client;
        case "subscriber":
          if (!subscriber) {
            subscriber = new Redis(REDIS_URL, redisOpts);
          }
          return subscriber;
        case "bclient":
          return new Redis(REDIS_URL, redisOpts);
        default:
          throw new Error("Unexpected connection type: ", type);
      }
    },
  };
  return opts;
};
