module.exports = {
  app: {
    httpsEnabled: false,
  },
  mongo: {
    uri: 'mongodb://localhost/techskills',
    debug: true,
  },
  jwt: {
    debugEnabled: true,
  },
  logger: {
    level: 'debug',
  },
};
