const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const { Schema } = mongoose;

const schemaOptions = {
  strict: false,
};


const userNameSchema = new Schema({
  first: { type: String, required: true },
  last: { type: String, required: true },
}, {
  _id: false,
});

const docinfoSchema = new Schema({
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const userSchema = new Schema({
  name: { type: userNameSchema, required: false },
  position: { type: String, required: false },
  email: {
    type: String,
    required: true,
    index: {
      name: 'email_1',
      unique: true,
    },
  },
  docinfo: {
    type: docinfoSchema,
  },
}, schemaOptions);


userSchema.pre('save', function preSave(next) {
  const user = this;
  const now = new Date().toISOString();

  user.set('docinfo.updatedAt', now);

  // save createdAt once
  if (!this.get('docinfo.createdAt')) {
    user.set('docinfo.createdAt', now);
  }

  if (!user.isModified('password')) {
    return next();
  }

  const newPassword = user.get('password');

  userSchema.statics.makeHash(newPassword)
    .then((hash) => {
      user.set('password', hash);
      next();
    })
    .catch(next);
});

userSchema.index(
  {
    email: 'text',
  },
);

function compareToHash(attempt, hash) {
  return new Promise((resolve, reject) => {
    if (!hash) {
      return resolve(false);
    }
    bcrypt.compare(attempt, hash, function compare(err, success) {
      if (err) {
        reject(err);
      } else {
        resolve(success);
      }
    });
  });
}

userSchema.methods.comparePassword = function comparePassword(attempt) {
  const hash = this.get('password');
  return compareToHash(attempt, hash);
};

userSchema.static('makeHash', function makeHash(str) {
  const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR) || 12;

  return new Promise(function makeHashPromise(resolve, reject) {
    // generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function bcryptSalt(saltErr, salt) {
      if (saltErr) {
        return reject(saltErr);
      }

      // hash string with salt
      bcrypt.hash(str, salt, function bcryptHash(hashErr, hash) {
        if (hashErr) {
          return reject(hashErr);
        }
        resolve(hash);
      });
    });
  });
});

userSchema.static('sanitize', async function sanitize(userDoc) {
  const user = userDoc.toObject({ virtuals: true });
  const fieldsToPick = [
    '_id',
    'email',
    'name',
    'position',
    'docinfo',
  ];
  return _.pick(user, fieldsToPick);
});

module.exports = userSchema;
