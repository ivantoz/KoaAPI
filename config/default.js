const mongos = process.env.MONGO_MONGOS
  ? {
    ssl: true,
    sslValidate: true,
    sslCA: process.env.MONGO_SSL_CA,
  }
  : null;

module.exports = {
  app: {
    loggingEnabled: true,
    httpsEnabled: true,
  },
  mongo: {
    connectionOptions: {
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
      mongos,
    },
  },
  jwt: {
    debugEnabled: false,
    accessTokenValiditySeconds: Number(process.env.ACCESS_TOKEN_VALIDITY_SECONDS) || 28 * 24 * 60 * 60,
  },
};
