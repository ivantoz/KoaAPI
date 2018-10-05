const _ = require('lodash');
const { Joi } = require('koa-joi-router');
Joi.objectId = require('joi-objectid')(Joi);


const removeFellowHandler = async (ctx, next) => {
  const { Fellow } = ctx.models;
  const { fellowId } = ctx.request.params;

  const user = await Fellow.findById(fellowId);
  ctx.assert(user, 404, 'fellow not found');

  user.findByIdAndRemove(fellowId)
    .catch((error) => {
      console.error(error);
      ctx.throw(400, `Failed to delete fellow with id: ${fellowId}`);
    });
  ctx.status = 204;

  return next();
};

module.exports = {
  method: 'delete',
  path: '/:fellowId/entitlements',
  validate: {
    params: {
      fellowId: Joi.objectId(),
    },
  },
  handler: [removeFellowHandler],
};
