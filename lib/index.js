const app = require('./app');
const db = require('../models');


const { PORT } = process.env;

// connect to db & listen
Promise.all([
  db.waitOnConnection(),
])
  .then(() => {
    app.listen(PORT, () => {
      console.info(`listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

module.exports = app;
