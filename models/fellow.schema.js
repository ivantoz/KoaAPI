const _ = require('lodash');
const mongoose = require('mongoose');

const { Schema } = mongoose;


const docinfoSchema = new Schema({
  createdAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String,
  },
});

const fellowNameSchema = new Schema({
  first: { type: String, required: true },
  middle: String,
  last: { type: String, required: true },
}, {
  _id: false,
});

const fellowSchema = new Schema({
  name: { type: fellowNameSchema, required: false },
  cohortName: { type: String, trim: true },
  dLevel: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    index: {
      name: 'email_1',
      unique: true,
    },
  },
  phone: { type: String, required: false, trim: true },
  docinfo: {
    type: docinfoSchema,
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

fellowSchema.index(
  {
    email: 'text',
  },
);


module.exports = fellowSchema;
