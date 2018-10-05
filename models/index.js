const config = require('config');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');


const readDir = promisify(fs.readdir);

const { NODE_ENV } = process.env;


const userSchema = require('./user.schema');
const fellowSchema = require('./fellow.schema');

mongoose.Promise = global.Promise;


const connectionOptions = config.get('mongo.connectionOptions');

mongoose.connection.on('error', (err) => {
  if (err) {
    console.error(err);
  }
});

mongoose.connection.on('open', (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`connected: '${mongoose.connection.db.s.databaseName}'`);
    // console.log('Connection successful to', mongoose.connection.db.s.databaseName);
  }
});

const applyMigrations = async (db) => {
  if (NODE_ENV.includes('test')) {
    return;
  }

  const migrations = db.collection('migrations');
  const files = await readDir(path.join(__dirname, '../migrations'));

  const fileNames = files.map(file => path.parse(file).name);

  const pastMigrations = await migrations.find({ name: { $in: fileNames } }).toArray();
  const pastMigrationFileNames = pastMigrations.map(m => m.name);

  const newMigrations = fileNames.filter(fileName => !pastMigrationFileNames.includes(fileName)).sort();

  // Need to make sure that migrations are applied one at a time and in order
  // eslint-disable-next-line no-restricted-syntax
  for (const fileName of newMigrations) {
    console.info(`beginning ${fileName} migration`);

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const migration = require(path.join(__dirname, `../migrations/${fileName}`));
    const migrationId = (await migrations.insert({ // eslint-disable-line no-await-in-loop
      name: fileName,
      startedAt: new Date(),
    })).insertedIds[0];

    await migration.apply(db); // eslint-disable-line no-await-in-loop

    // eslint-disable-next-line no-await-in-loop
    await migrations.update({ _id: migrationId }, { $set: { completedAt: new Date() } });
    console.info(`completed ${fileName} migration`);
  }
};


const models = {
  User: mongoose.model('User', userSchema),
  Fellow: mongoose.model('Fellow', fellowSchema),
};

// connect & return promise
const uri = config.get('mongo.uri');

const waitOnConnection = () => mongoose.connect(uri, connectionOptions)
  .then(() => applyMigrations(mongoose.connection.db));

module.exports = { waitOnConnection, models };
