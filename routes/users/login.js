const { Joi } = require('koa-joi-router');
const issueJWT = require('../../lib/issue-jwt');

const loginHandler = async (ctx, next) => {
  const { User } = ctx.models;
  const { email, password } = ctx.request.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  ctx.assert(user, 404, 'user not found');

  const passwordIsValid = await user.comparePassword(password);
  ctx.assert(passwordIsValid, 422, 'invalid password');
  user.set('docinfo.updatedAt', new Date().toISOString());
  await user.save();
  ctx.state.user = user;
  await next();

  ctx.status = 200;
};

module.exports = {
  method: 'post',
  path: '/login',
  validate: {
    type: 'json',
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
  handler: [loginHandler, issueJWT],
};
