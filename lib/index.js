const createApp = require('./createApp');

const { PORT } = process.env;

async function main() {
  try {
    const app = await createApp();
    await app.listen(PORT);
    console.info(`app: listening on port ${PORT}`);
    return app;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = main();
