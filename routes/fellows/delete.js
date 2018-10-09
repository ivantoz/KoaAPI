const _ = require('lodash');
const { Joi } = require('koa-joi-router');
Joi.objectId = require('joi-objectid')(Joi);


const removeFellowHandler = async (ctx, next) => {
  const { Fellow } = ctx.models;
  const { id } = ctx.request.params;

  const fellow = await Fellow.findById(id);
  ctx.assert(fellow, 404, 'fellow not found');

  await Fellow.findOneAndRemove({ _id: id })
    .catch((error) => {
      console.error(error);
      ctx.throw(400, `Failed to delete fellow with id: ${id}`);
    });
  ctx.status = 204;

  return next();
};

module.exports = {
  method: 'delete',
  path: '/:id/fellow',
  validate: {
    params: {
      fellowId: Joi.objectId(),
    },
  },
  handler: [removeFellowHandler],
};
