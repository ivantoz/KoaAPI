const _ = require('lodash');
const makeToken = require('./make-token');

async function issueJwt(ctx) {
  const { user } = ctx.state;

  const { User } = ctx.models;
  try {
    const sanitizedUser = await User.sanitize(user);
    const token = await makeToken(sanitizedUser);

    ctx.body = Object.assign({}, ctx.body, {
      token,
      user: sanitizedUser,
    });
  } catch (err) {
    if (err.status < 500) {
      ctx.throw(err.status, err.message);
    }
    console.error(`Failed to issue jwt for user=${user._id}`, err);
    ctx.throw(500, 'Failed to issue jwt');
  }
}

module.exports = issueJwt;
