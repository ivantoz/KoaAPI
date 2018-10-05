const _ = require('lodash');
const { Joi } = require('koa-joi-router');

module.exports = {
  method: 'post',
  path: '/register',
  validate: {
    type: 'json',
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
      }).required(),
      position: Joi.string().required(),
    },
  },
  handler: async (ctx) => {
    const newUserTosave = ctx.request.body;
    const { User } = ctx.models;

    const userAccount = await User
      .findOne({ email: newUserTosave.email })
      .exec();

    ctx.assert(userAccount, 400, `${newUserTosave.email} already registered`);
    newUserTosave.docinfo = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newUser = new User(newUserTosave);
    await newUser.save();
    console.info(`user with id=${newUser._id} is saved`);
    ctx.user = newUser;
    ctx.body = newUser.sanitize(ctx.state);
  },
};
