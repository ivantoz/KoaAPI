const { Joi } = require('koa-joi-router');
Joi.objectId = require('joi-objectid')(Joi);


module.exports = {
  method: 'get',
  path: '/:id',
  validate: {
    params: {
      id: Joi.objectId(),
    },
  },
  handler: async (ctx) => {
    const { Fellow } = ctx.models;
    const { id } = ctx.request.params;
    const fellow = await Fellow.findById(id)
      .exec();
    ctx.assert(fellow, 404, 'user not found');
    ctx.body = fellow;
    ctx.status = 200;
  },
};
