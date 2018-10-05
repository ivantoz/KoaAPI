module.exports = {
  app: {
    httpsEnabled: false,
  },
  mongo: {
    uri: 'mongodb://localhost/authentication',
    debug: true,
  },
  jwt: {
    debugEnabled: true,
  },
  logger: {
    level: 'debug',
  },
};
