const app = require('./app');
const db = require('../models');


const { PORT } = process.env;


db.waitOnConnection()
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
