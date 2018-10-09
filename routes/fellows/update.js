const { Joi } = require('koa-joi-router');
Joi.objectId = require('joi-objectid')(Joi);
const objectToDotNotation = require('../../lib/objectToDotNotation');

module.exports = {
  method: 'patch',
  path: '/:id',
  validate: {
    type: 'json',
    params: {
      id: Joi.objectId().required(),
    },
    body: Joi.object({
      _id: Joi.forbidden(),
    }).unknown(),
  },
  handler: [
    async (ctx) => {
      const { Fellow } = ctx.models;
      const { id } = ctx.request.params;
      const fellowUpdates = ctx.request.body;
      const { _id } = ctx.state.jwt;

      fellowUpdates.docinfo = {
        updatedAt: new Date().toISOString(),
        updatedBy: _id,
      };

      const fellow = await objectToDotNotation(fellowUpdates);
      const updatedFellow = await Fellow.findOneAndUpdate({ _id: id }, { $set: fellow }, { new: true })
        .catch((error) => {
          console.error(error);
          ctx.throw(400, `Failed to update fellow with id: ${id}`);
        });
      ctx.assert(updatedFellow, 404, 'fellow not found');

      ctx.body = updatedFellow;
      ctx.status = 200;
    },
  ],
};
