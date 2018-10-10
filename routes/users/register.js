const { Joi } = require('koa-joi-router');

module.exports = {
  method: 'post',
  path: '/register',
  validate: {
    type: 'json',
    body: {
      email: Joi.string().lowercase().email().required(),
      password: Joi.string().required(),
      name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
      }).required(),
      position: Joi.string().required(),
    },
  },
  handler: [async (ctx) => {
    const newUserTosave = ctx.request.body;
    const { User } = ctx.models;

    const userAccount = await User
      .findOne({ email: newUserTosave.email })
      .exec();

    if (userAccount) {
      ctx.throw(400, `${newUserTosave.email} already registered`);
    }

    const newUser = new User(newUserTosave);
    await newUser.save();
    console.info(`user with id=${newUser._id} is saved`);
    ctx.body = await User.sanitize(newUser);
    ctx.status = 201;
  },
  ],
};
